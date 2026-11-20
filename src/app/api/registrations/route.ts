import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";
import { generateRegistrationNumber, normalizePhoneForLookup } from "@/lib/utils";
import { sendRegistrationReceivedSMS } from "@/lib/sms";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const full_name = String(body.full_name || "").trim();
    const gender = String(body.gender || "").trim();
    const age_group = String(body.age_group || "").trim();
    const rawPhone = String(body.phone_number || "").trim();
    const email = String(body.email || "").trim();
    const community = String(body.community || "").trim();
    const occupation = String(body.occupation || "").trim();
    const experience_level = String(body.experience_level || "Beginner").trim();
    const focus_interest = String(body.focus_interest || "Modern Palm Oil Processing").trim();
    const id_number = String(body.id_number || "").trim();
    const registration_type = "register";
    const available_all_5_days = body.available_all_5_days !== false;
    const notes = String(body.notes || "").trim();

    if (!full_name || full_name.length < 2) {
      return NextResponse.json(
        { error: "Please enter your full name." },
        { status: 400 }
      );
    }
    if (!gender) {
      return NextResponse.json(
        { error: "Please select your gender." },
        { status: 400 }
      );
    }

    const normalizedPhone = normalizePhoneForLookup(rawPhone);
    if (!normalizedPhone || normalizedPhone.length < 9) {
      return NextResponse.json(
        { error: "Please enter a valid phone number (e.g. 024XXXXXXX or +23324XXXXXXX)." },
        { status: 400 }
      );
    }

    if (!community) {
      return NextResponse.json(
        { error: "Please enter your community or electoral area." },
        { status: 400 }
      );
    }

    if (!occupation) {
      return NextResponse.json(
        { error: "Please select your current role or occupation." },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();

    // Check for duplicate registration by phone number
    const { data: existingList } = await supabase
      .from("kboil_registrations")
      .select("registration_number, full_name, phone_number")
      .or(`phone_number.eq.${normalizedPhone},phone_number.eq.${rawPhone}`);

    if (existingList && existingList.length > 0) {
      const existing = existingList[0];
      return NextResponse.json(
        {
          error: `This phone number is already registered under Ref: ${existing.registration_number}. You can check your status on the Track page.`,
          existingRef: existing.registration_number,
        },
        { status: 409 }
      );
    }

    // Generate unique registration number
    let registration_number = generateRegistrationNumber();
    for (let attempt = 0; attempt < 5; attempt++) {
      const { data: conflict } = await supabase
        .from("kboil_registrations")
        .select("id")
        .eq("registration_number", registration_number)
        .maybeSingle();
      if (!conflict) break;
      registration_number = generateRegistrationNumber();
    }

    const insertPayload = {
      registration_number,
      registration_type,
      full_name,
      gender,
      age_group,
      phone_number: normalizedPhone,
      email,
      community,
      occupation,
      experience_level,
      focus_interest,
      id_number,
      available_all_5_days,
      notes,
      status: "confirmed",
      sms_sent: false,
    };

    const { data: created, error: insertError } = await supabase
      .from("kboil_registrations")
      .insert(insertPayload)
      .select()
      .single();

    if (insertError || !created) {
      console.error("[POST /api/registrations] Insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to save registration. Please try again." },
        { status: 500 }
      );
    }

    // Send immediate SMS notification via Arkesel
    const smsResult = await sendRegistrationReceivedSMS({
      full_name: created.full_name,
      phone_number: created.phone_number,
      registration_number: created.registration_number,
    });

    // Record SMS result on the registration row
    await supabase
      .from("kboil_registrations")
      .update({
        sms_sent: smsResult.success,
        sms_response: smsResult.response || smsResult.error || "",
      })
      .eq("id", created.id);

    // Log submission event
    await supabase.from("kboil_registration_logs").insert({
      registration_id: created.id,
      action: "REGISTRATION_CONFIRMED",
      previous_status: null,
      new_status: "confirmed",
      notes: smsResult.success
        ? "Registration automatically confirmed and acceptance SMS sent."
        : `Registration automatically confirmed. SMS warning: ${smsResult.error || "Unknown"}`,
      performed_by: "system",
    });

    return NextResponse.json(
      {
        success: true,
        registration: {
          ...created,
          sms_sent: smsResult.success,
        },
        smsSent: smsResult.success,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error("[POST /api/registrations] Unexpected error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred while processing your registration." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = (searchParams.get("q") || searchParams.get("ref") || searchParams.get("phone") || "").trim();

    if (!query) {
      return NextResponse.json(
        { error: "Please provide a Registration Reference Number or Phone Number." },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();
    const cleanedRef = query.toUpperCase();
    const normalizedPhone = normalizePhoneForLookup(query);

    let result = null;

    if (cleanedRef.startsWith("OPR-")) {
      const { data } = await supabase
        .from("kboil_registrations")
        .select(
          "id, registration_number, registration_type, full_name, gender, community, occupation, experience_level, focus_interest, available_all_5_days, status, sms_sent, created_at, updated_at"
        )
        .ilike("registration_number", cleanedRef)
        .maybeSingle();
      result = data;
    }

    if (!result && normalizedPhone.length >= 9) {
      const { data } = await supabase
        .from("kboil_registrations")
        .select(
          "id, registration_number, registration_type, full_name, gender, community, occupation, experience_level, focus_interest, available_all_5_days, status, sms_sent, created_at, updated_at"
        )
        .or(`phone_number.eq.${normalizedPhone},phone_number.eq.${query}`)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      result = data;
    }

    if (!result) {
      return NextResponse.json(
        { error: "No registration found matching that reference number or phone number." },
        { status: 404 }
      );
    }

    return NextResponse.json({ registration: result });
  } catch (err: unknown) {
    console.error("[GET /api/registrations] Error:", err);
    return NextResponse.json(
      { error: "Failed to look up registration status." },
      { status: 500 }
    );
  }
}
