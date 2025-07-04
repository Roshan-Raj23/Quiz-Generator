'use client';

import { useState } from 'react';
// import { GoogleGenerativeAI } from "@google/generative-ai";


export default function Home() {
    const [topic, setTopic] = useState('hello');
    const [quiz, setQuiz] = useState('');
    const [loading, setLoading] = useState(false);


    
    const geminiResponse = async () => {


        // const API_KEY: string = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        // const genAI = new GoogleGenerativeAI(API_KEY);

        // // This function sends any question to Gemini and returns the response
        // async function askGemini(question: string) {
        //     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // or "gemini-1.5-pro"
            
        //     const result = await model.generateContent(question);
        //     const response = await result.response;
        //     const text = response.text();

        //     return text;
        // }

        // askGemini(topic);



        const payload = {
            "contents": [{
                    "parts": [{
                        "text": topic
                    }]
            }]
        }

        const url = process.env.NEXT_PUBLIC_GEMINI_URL;

        let response = await fetch(url , {
            method: 'POST',
            body: JSON.stringify(payload),
            // 'Content-Type' : 'application/json'
        })

        response = await response.json();
        return response.candidates[0].content.parts[0].text;

    }


    const generateQuiz = async () => {
        setLoading(true);
        setQuiz('');

        try {
            const data = await geminiResponse()
            setQuiz(data || 'No quiz returned');
        } catch (err) {
            console.error(err);
            setQuiz('Error generating quiz');
        } finally {
            setLoading(false);
        }
    };


    return (
        <main style={{ padding: '2rem' }}>
        <h1>AI Quiz Generator</h1>
        <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter topic (e.g. history, math)"
            style={{ padding: '0.5rem', width: '300px' }}
        />
        <button onClick={generateQuiz} style={{ marginLeft: '1rem', padding: '0.5rem 1rem' }} 
        className='bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer disabled:bg-gray-300'
        >
            Generate Quiz
        </button>
        {loading && <p>Generating quiz...</p>}
        {quiz && (
            <pre style={{ whiteSpace: 'pre-wrap', background: '#f9f9f9', padding: '1rem', marginTop: '1rem' }}>
            {quiz}
            </pre>
        )}
        </main>
    );
}
