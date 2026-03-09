import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const systemPrompts: Record<string, string> = {
  character: `You are a creative writing assistant specializing in character creation for fantasy, sci-fi, and web novels. Generate a unique, detailed character. Return ONLY a JSON object with these exact keys: Name, Role, Setting, Personality, Goal, Secret, Weakness. Each value should be 1-3 sentences. Be creative, original, and avoid clichés.`,
  name: `You are a fantasy name generator. Generate 5 unique, creative fantasy names. Return ONLY a JSON object with these exact keys: Style, Type, "Generated Names". The "Generated Names" value should be 5 names separated by newlines, some with titles/epithets.`,
  cultivation: `You are an expert in xianxia/cultivation novel worldbuilding. Generate a unique cultivation system. Return ONLY a JSON object with these exact keys: "Realm Name", Genre, "Power System", "Progression Stages", "Unique Rule". Be creative and detailed.`,
  plot: `You are a master storyteller specializing in plot twists. Generate a shocking, original plot twist. Return ONLY a JSON object with these exact keys: Genre, "Plot Twist", "Story Impact". The plot twist should be 2-3 sentences and genuinely surprising.`,
  villain: `You are a character designer specializing in complex antagonists. Generate a compelling villain with depth. Return ONLY a JSON object with these exact keys: Name, Archetype, "Origin Story", Motivation, Weakness. The origin story should be 2-3 sentences.`,
  world: `You are a worldbuilding expert for fantasy and sci-fi fiction. Generate a unique world/kingdom. Return ONLY a JSON object with these exact keys: "Kingdom Name", Theme, "Magic System", "World Lore", "Notable Feature". Each value should be 1-3 sentences.`,
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { generatorType, inputs } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = systemPrompts[generatorType];
    if (!systemPrompt) throw new Error(`Unknown generator type: ${generatorType}`);

    // Build user prompt from inputs
    const inputParts = Object.entries(inputs || {})
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}: ${v}`);
    
    const userPrompt = inputParts.length > 0
      ? `Generate with these preferences:\n${inputParts.join("\n")}`
      : "Generate something completely random and creative.";

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.9,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits in Settings → Workspace → Usage." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) throw new Error("No content in AI response");

    // Parse JSON from the response (handle markdown code blocks)
    let parsed;
    try {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, content];
      parsed = JSON.parse(jsonMatch[1].trim());
    } catch {
      // If JSON parsing fails, return raw content
      parsed = { Result: content };
    }

    return new Response(JSON.stringify({ result: parsed }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Generate error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
