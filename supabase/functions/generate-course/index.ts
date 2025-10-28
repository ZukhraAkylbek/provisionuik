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

    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
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

Создай минимум 3 модуля, 10 флэшкарт, 5 ситуаций и 10 тестов. Весь контент должен быть на русском языке.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Gemini response received');

    const generatedText = data.candidates[0].content.parts[0].text;
    
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