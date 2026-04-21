import { NextResponse } from "next/server";

type EnquiryPayload = {
  fullName?: string;
  email?: string;
  organisation?: string;
  phone?: string;
  interest?: string;
  message?: string;
};

export async function POST(request: Request) {
  const payload = (await request.json()) as EnquiryPayload;

  if (
    !payload.fullName?.trim() ||
    !payload.email?.trim() ||
    !payload.phone?.trim() ||
    !payload.message?.trim()
  ) {
    return NextResponse.json(
      { message: "Please complete all required enquiry fields." },
      { status: 400 },
    );
  }

  return NextResponse.json({
    message: "Enquiry submitted successfully.",
    receivedAt: new Date().toISOString(),
  });
}
