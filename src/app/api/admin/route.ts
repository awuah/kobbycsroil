import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";
import { getAdminFromRequest, isValidAdminPasscode, getAdminIdentity } from "@/lib/auth";
import { sendRegistrationConfirmedSMS } from "@/lib/sms";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.action === "logout") {
      const res = NextResponse.json({ success: true });
      res.cookies.set("kboil_admin_auth", "", {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 0,
      });
      return res;
    }

    const passcode = String(body.passcode || "").trim();
    if (!isValidAdminPasscode(passcode)) {
      return NextResponse.json(
        { error: "Invalid administrator passcode." },
        { status: 401 }
      );
    }

    const identity = getAdminIdentity(passcode);
    const res = NextResponse.json({ success: true, admin: identity });
    res.cookies.set("kboil_admin_auth", encodeURIComponent(passcode), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 12, // 12 hours
    });
    return res;
  } catch (err: unknown) {
    console.error("[POST /api/admin] Error:", err);
    return NextResponse.json({ error: "Authentication failed." }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const auth = getAdminFromRequest(req);
  if (!auth.isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from("kboil_registrations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[GET /api/admin] DB error:", error);
      return NextResponse.json(
        { error: "Failed to load registrations." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      registrations: data || [],
      admin: auth.identity,
    });
  } catch (err: unknown) {
    console.error("[GET /api/admin] Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const auth = getAdminFromRequest(req);
  if (!auth.isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const id = String(body.id || "").trim();
    const status = String(body.status || "").trim();
    const admin_notes = body.admin_notes !== undefined ? String(body.admin_notes) : undefined;
    const sendConfirmationSms = Boolean(body.sendConfirmationSms);

    if (!id) {
      return NextResponse.json({ error: "Missing registration ID." }, { status: 400 });
    }

    const supabase = getServiceSupabase();
    const { data: existing, error: fetchError } = await supabase
      .from("kboil_registrations")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json({ error: "Registration not found." }, { status: 404 });
    }

    const updateFields: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    if (status) updateFields.status = status;
    if (admin_notes !== undefined) updateFields.admin_notes = admin_notes;

    const { data: updated, error: updateError } = await supabase
      .from("kboil_registrations")
      .update(updateFields)
      .eq("id", id)
      .select()
      .single();

    if (updateError || !updated) {
      return NextResponse.json({ error: "Failed to update registration." }, { status: 500 });
    }

    let smsSent = false;
    if (sendConfirmationSms && status === "confirmed") {
      const smsRes = await sendRegistrationConfirmedSMS({
        full_name: updated.full_name,
        phone_number: updated.phone_number,
        registration_number: updated.registration_number,
      });
      smsSent = smsRes.success;
    }

    await supabase.from("kboil_registration_logs").insert({
      registration_id: id,
      action: "STATUS_UPDATED",
      previous_status: existing.status,
      new_status: updated.status,
      notes: `${admin_notes || ""}${smsSent ? " [Confirmation SMS sent]" : ""}`.trim(),
      performed_by: auth.identity.name,
    });

    return NextResponse.json({
      success: true,
      registration: updated,
      confirmationSmsSent: smsSent,
    });
  } catch (err: unknown) {
    console.error("[PATCH /api/admin] Error:", err);
    return NextResponse.json({ error: "Failed to update registration." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const auth = getAdminFromRequest(req);
  if (!auth.isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing registration ID." }, { status: 400 });
    }

    const supabase = getServiceSupabase();
    const { error } = await supabase
      .from("kboil_registrations")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: "Failed to delete registration." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("[DELETE /api/admin] Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
