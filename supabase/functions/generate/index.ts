import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const systemPrompts: Record<string, string> = {
  character: `You are an elite creative writing assistant specializing in deep character creation for web novels, xianxia, LitRPG, and fantasy fiction. Your characters must feel epic, layered, and ready for a bestselling novel.

Generate a rich, unique protagonist profile. Return ONLY a valid JSON object with EXACTLY these keys:
- "Name": A memorable, genre-appropriate name with title/alias if fitting
- "Title / Alias": An epic title, alias, or nickname (e.g. "The Void Sovereign", "Ghost of the Seventh Realm")
- "Race": Race or species with a brief distinguishing detail
- "Role": Their narrative role (e.g. Reluctant Protagonist, Anti-Hero, Chosen Exile)
- "World Setting": The world/universe they inhabit — 1 vivid sentence
- "Personality": 3-5 core traits in a comma-separated list, then 1 sentence describing how they manifest
- "Backstory": A 2-3 sentence origin that is emotionally compelling and sets up conflict
- "Abilities / Powers": 3-4 named abilities or techniques, each on a new line starting with •
- "Goal / Motivation": Their driving ambition — what they want and why it matters to them
- "Secret": A hidden truth about them that would change everything if revealed
- "Weakness": A genuine vulnerability — physical, emotional, or both
- "Character Arc Potential": A short arc description (e.g. "From hunted outcast → reluctant savior → world-shaping legend")

Be creative, bold, and avoid generic tropes. Make it feel like a page-turner.`,
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
    const { generatorType, inputs, datasetSelections } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = systemPrompts[generatorType];
    if (!systemPrompt) throw new Error(`Unknown generator type: ${generatorType}`);

    // Build user prompt from inputs AND dataset selections
    const inputParts = Object.entries(inputs || {})
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}: ${v}`);
    
    // Build dataset context
    const datasetParts: string[] = [];
    const ds = datasetSelections || {};
    
    if (generatorType === "character") {
      if (ds.dataName) datasetParts.push(`Suggested Name: ${ds.dataName}`);
      if (ds.dataTrait) datasetParts.push(`Core Personality Trait: ${ds.dataTrait}`);
      if (ds.dataPower) datasetParts.push(`Primary Ability: ${ds.dataPower}`);
      if (ds.dataRealm) datasetParts.push(`Cultivation Realm: ${ds.dataRealm}`);
      if (ds.dataConflict) datasetParts.push(`World Conflict: ${ds.dataConflict}`);
    } else if (generatorType === "world") {
      if (ds.dataKingdom) datasetParts.push(`Kingdom Name: ${ds.dataKingdom}`);
      if (ds.dataMonster) datasetParts.push(`Dominant Monster: ${ds.dataMonster}`);
      if (ds.dataMagic) datasetParts.push(`Magic System Base: ${ds.dataMagic}`);
      if (ds.dataConflict) datasetParts.push(`World Conflict: ${ds.dataConflict}`);
    } else if (generatorType === "cultivation") {
      if (ds.dataRealms) datasetParts.push(`Use these cultivation stages as a foundation: ${ds.dataRealms}`);
    } else if (generatorType === "villain") {
      if (ds.dataName) datasetParts.push(`Villain Name: ${ds.dataName}`);
      if (ds.dataTrait) datasetParts.push(`Core Trait: ${ds.dataTrait}`);
      if (ds.dataPower) datasetParts.push(`Signature Power: ${ds.dataPower}`);
      if (ds.dataSect) datasetParts.push(`Affiliated Sect: ${ds.dataSect}`);
    } else if (generatorType === "name") {
      if (ds.dataSamples) datasetParts.push(`Use these as style inspiration (do NOT copy them): ${ds.dataSamples}`);
    } else if (generatorType === "plot") {
      if (ds.dataConflict) datasetParts.push(`Base Conflict: ${ds.dataConflict}`);
      if (ds.dataKingdom) datasetParts.push(`Setting: ${ds.dataKingdom}`);
      if (ds.dataMonster) datasetParts.push(`Key Creature: ${ds.dataMonster}`);
    }

    let userPrompt = "";
    if (datasetParts.length > 0) {
      userPrompt += `Use the following dataset-selected elements to guide your creation:\n${datasetParts.join("\n")}\n\n`;
    }
    if (inputParts.length > 0) {
      userPrompt += `Additional preferences from the user:\n${inputParts.join("\n")}\n\n`;
    }
    if (!userPrompt) {
      userPrompt = "Generate something completely random and creative.";
    } else {
      userPrompt += "Weave these elements together into something creative and cohesive. Do not simply list them back — use them as inspiration for a rich, original creation.";
    }

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
