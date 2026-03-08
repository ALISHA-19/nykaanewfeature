import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64 } = await req.json();
    if (!imageBase64) {
      return new Response(JSON.stringify({ error: "No image provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `You are an expert dermatologist and beauty consultant. Analyze this selfie photo and provide a detailed skin analysis. Return your response as a valid JSON object with exactly this structure (no markdown, no code fences, just raw JSON):

{
  "skinType": "oily" | "dry" | "combination" | "normal" | "sensitive",
  "undertone": "warm" | "cool" | "neutral",
  "concerns": ["list of 2-4 visible skin concerns like acne, dark spots, fine lines, dullness, redness, large pores, uneven texture, dehydration"],
  "foundationShade": "MAC shade code like NC15, NC25, NC35, NC42, NC50, NW20, NW35, NW45",
  "shadeLabel": "descriptive label like Fair Warm, Light-Medium Neutral, Medium Warm, etc.",
  "morningRoutine": [
    {"step": 1, "product": "product type", "reason": "why this step", "suggestion": "specific product name and brand"},
    ...up to 5 steps
  ],
  "nightRoutine": [
    {"step": 1, "product": "product type", "reason": "why this step", "suggestion": "specific product name and brand"},
    ...up to 5 steps
  ],
  "tips": ["2-3 personalized beauty tips based on what you see"]
}

Be specific and personalized based on what you actually observe in the photo.`,
                },
                {
                  type: "image_url",
                  image_url: {
                    url: imageBase64.startsWith("data:")
                      ? imageBase64
                      : `data:image/jpeg;base64,${imageBase64}`,
                  },
                },
              ],
            },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "skin_analysis",
                description: "Return structured skin analysis results",
                parameters: {
                  type: "object",
                  properties: {
                    skinType: {
                      type: "string",
                      enum: ["oily", "dry", "combination", "normal", "sensitive"],
                    },
                    undertone: {
                      type: "string",
                      enum: ["warm", "cool", "neutral"],
                    },
                    concerns: {
                      type: "array",
                      items: { type: "string" },
                    },
                    foundationShade: { type: "string" },
                    shadeLabel: { type: "string" },
                    morningRoutine: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          step: { type: "number" },
                          product: { type: "string" },
                          reason: { type: "string" },
                          suggestion: { type: "string" },
                        },
                        required: ["step", "product", "reason", "suggestion"],
                      },
                    },
                    nightRoutine: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          step: { type: "number" },
                          product: { type: "string" },
                          reason: { type: "string" },
                          suggestion: { type: "string" },
                        },
                        required: ["step", "product", "reason", "suggestion"],
                      },
                    },
                    tips: {
                      type: "array",
                      items: { type: "string" },
                    },
                  },
                  required: [
                    "skinType",
                    "undertone",
                    "concerns",
                    "foundationShade",
                    "shadeLabel",
                    "morningRoutine",
                    "nightRoutine",
                    "tips",
                  ],
                },
              },
            },
          ],
          tool_choice: {
            type: "function",
            function: { name: "skin_analysis" },
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits depleted. Please add funds." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: "AI analysis failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();

    // Extract from tool call
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      const analysis = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify(analysis), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fallback: try parsing content directly
    const content = data.choices?.[0]?.message?.content;
    if (content) {
      const cleaned = content.replace(/```json\n?|\n?```/g, "").trim();
      const analysis = JSON.parse(cleaned);
      return new Response(JSON.stringify(analysis), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ error: "Could not parse AI response" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("skin-analysis error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
