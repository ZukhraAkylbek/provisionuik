import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic } = await req.json();
    console.log('Generating course for topic:', topic);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const prompt = `Создай структуру образовательного курса на тему: "${topic}".

Верни JSON объект со следующей структурой:
{
  "mindmap": {
    "title": "название курса",
    "modules": [
      {
        "id": "module_1",
        "title": "название модуля",
        "description": "описание модуля",
        "topics": ["тема 1", "тема 2", "тема 3"]
      }
    ]
  },
  "flashcards": [
    {
      "front": "вопрос",
      "back": "ответ",
      "module": "module_1"
    }
  ],
  "situations": [
    {
      "title": "название ситуации",
      "scenario": "описание сценария",
      "questions": ["вопрос 1", "вопрос 2"],
      "module": "module_1"
    }
  ],
  "tests": [
    {
      "question": "вопрос",
      "options": ["вариант 1", "вариант 2", "вариант 3", "вариант 4"],
      "correctAnswer": 0,
      "explanation": "объяснение правильного ответа",
      "module": "module_1"
    }
  ]
}

Создай минимум 3 модуля, 10 флэшкарт, 5 ситуаций и 10 тестов. Весь контент должен быть на русском языке. Верни только JSON, без дополнительного текста.`;

    const response = await fetch(
      'https://ai.gateway.lovable.dev/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Превышен лимит запросов, попробуйте позже' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Требуется пополнение баланса' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI response received');

    const generatedText = data.choices[0].message.content;
    
    // Extract JSON from the response (remove markdown code blocks if present)
    let jsonText = generatedText;
    if (generatedText.includes('```json')) {
      jsonText = generatedText.split('```json')[1].split('```')[0].trim();
    } else if (generatedText.includes('```')) {
      jsonText = generatedText.split('```')[1].split('```')[0].trim();
    }

    const courseData = JSON.parse(jsonText);

    return new Response(JSON.stringify(courseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-course function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});