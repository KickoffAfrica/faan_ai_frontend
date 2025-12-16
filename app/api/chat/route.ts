import { NextRequest, NextResponse } from "next/server";

/**
 * This is a mock API route for testing the chat interface.
 * Replace this with your actual backend API endpoint.
 * 
 * To use this mock:
 * 1. Set NEXT_PUBLIC_CHAT_API_ENDPOINT=/api/chat in your .env.local
 * 2. Or remove the env variable to use the default "/api/chat"
 */

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const message = formData.get("message") as string;
    const image = formData.get("image") as File | null;
    const conversationId = formData.get("conversationId") as string | null;

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock response based on message content
    let response = "";

    if (message.toLowerCase().includes("income tax")) {
      response = `The current personal income tax rates in Nigeria for 2025 are progressive:
      
- First ₦300,000: 7%
- Next ₦300,000: 11%
- Next ₦500,000: 15%
- Next ₦500,000: 19%
- Next ₦1,600,000: 21%
- Above ₦3,200,000: 24%

Companies are taxed at a flat rate of 30% on their profits.`;
    } else if (message.toLowerCase().includes("registration") || message.toLowerCase().includes("tin")) {
      response = `To register for a Tax Identification Number (TIN) in Nigeria:

1. Visit the FIRS website at www.firs.gov.ng
2. Click on "Register for TIN"
3. Fill the online registration form
4. Submit required documents (ID, utility bill, etc.)
5. Your TIN will be generated instantly

You can also visit any FIRS office for in-person registration.`;
    } else if (message.toLowerCase().includes("vat")) {
      response = `Nigeria's Value Added Tax (VAT) for 2025:

- Standard VAT rate: 7.5%
- Applies to most goods and services
- Zero-rated items: Basic food items, medical services, exports
- Exempt items: Financial services, residential rent, certain educational services

Businesses with annual turnover exceeding ₦25 million must register for VAT.`;
    } else if (message.toLowerCase().includes("deduction")) {
      response = `Tax deductions available for small businesses in Nigeria:

1. Consolidated Relief Allowance (CRA): Higher of ₦200,000 or 1% of gross income + 20% of gross income
2. National Housing Fund (NHF): 2.5% of basic salary
3. Pension contributions: 8% employee + 10% employer
4. Life assurance premium: Limited deduction
5. National Health Insurance: Contributions are deductible

Keep proper records and receipts for all deductions claimed.`;
    } else if (image) {
      response = `I can see you've uploaded an image. While I can receive images, in this mock version I cannot analyze them. Your actual backend should process the image and provide relevant tax advice based on its content.

Regarding your question: "${message}"

Please provide more specific details so I can assist you better with Nigerian tax regulations.`;
    } else {
      response = `Thank you for your question about Nigerian tax laws. 

I'm here to help with:
- Income tax rates and calculations
- Tax registration (TIN, VAT)
- Tax deductions and allowances
- Filing requirements and deadlines
- Company taxation
- Personal income tax
- And more...

Could you please provide more specific details about what you'd like to know?`;
    }

    return NextResponse.json({
      response,
      conversationId: conversationId || `conv_${Date.now()}`,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        error: "An error occurred while processing your request.",
      },
      { status: 500 }
    );
  }
}

