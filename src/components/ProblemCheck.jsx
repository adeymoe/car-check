import React, { useState } from 'react'

const ProblemCheck = () => {

  const [problemText, setProblemText] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [carSolution, setCarSolution] = useState("");

  const commonIssues = [
    "Car won't start",
    "Engine overheating",
    "Brakes making noise",
    "Battery draining quickly",
    "Steering feels loose",
    "Check engine light on",
    "Transmission slipping"
  ];

  const handleProblemTextChange = (e) => {
    const problemTextChange = e.target.value;
    setProblemText(problemTextChange);

    if (problemTextChange.length > 2) {
      const filteredSuggestions = commonIssues.filter(issue =>
        issue.toLowerCase().includes(problemTextChange.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    checkIssue(problemText);

    // Simulate an AI response
    // setTimeout(() => {
    //   alert("AI is analyzing your car problem...");
    //   setLoading(false);
    // }, 2000);
  };


  //Speech-to-text Functionality
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Your browser doesn't support speech recognition. Try using Chrome.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event) => console.error("Speech Recognition Error:", event.error);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setProblemText(prev => prev + " " + transcript);
      updateSuggestions(transcript);
    };

    recognition.start();
  };

  // const updateSuggestions = (text) => {
  //   if (text.length > 2) {
  //     const filteredSuggestions = commonIssues.filter(issue =>
  //       issue.toLowerCase().includes(text.toLowerCase())
  //     );
  //     setSuggestions(filteredSuggestions);
  //   } else {
  //     setSuggestions([]);
  //   }
  // };

  const checkIssue = async (problemText) => {


    if (problemText.trim() === "") {
      alert("No Text Entered");
      return;
    }

    setLoading(true);

    const prompt = `Analyze the following car issue based on the user's description:
Problem Description: ${problemText}

Instructions:
 Identify the possible issue(s) based on symptoms, sounds, smells, warning lights, environmental factors, and any error codes.
 List the most likely causes (ranked by probability).
 Provide actionable troubleshooting steps the user can take, starting from easiest to most complex.
 Indicate urgency level (⚠️ Minor, 🔧 Needs Attention, 🚨 Critical - Immediate Fix Required).
 Suggest estimated repair costs (if possible).
 Give preventive maintenance tips to avoid future occurrences.

Output Format:

Issue Diagnosis: [Short summary of the problem]
Possible Causes: [Bullet list of likely reasons]
Suggested Fixes: [Step-by-step guide to troubleshooting]
Urgency Level: [⚠️ / 🔧 / 🚨]
Estimated Repair Cost: [$ - $$$$]
Prevention Tips: [Best practices to prevent the issue]
Make the response clear, concise, and easy to understand, even for non-technical users. and return a response format that will look good inside a div`

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        }),
      });

      const data = await response.json();

      if (data.candidates && data.candidates.length > 0) {
        setCarSolution(data.candidates[0].content.parts[0].text);
        setLoading(false);
      } else {
        setCarSolution("Look for help!");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error checking post:", error);
      setCarSolution("Failed to perform check");
      setLoading(false);
    }
  }


  return (
    <div className='problemCheck'>
      <form onSubmit={handleSubmit}>
        <label htmlFor="problemBox">WHAT TROUBLE ARE YOU FACING WITH YOUR VEHICLE?</label>
        <div className='textareaContainer'>
          <textarea
            name="problemBox"
            id="problemBox"
            value={problemText}
            onChange={(e) => {
              setProblemText(e.target.value);
              handleProblemTextChange;
            }}
            placeholder='Tips: Describe your car issue in detail. Include symptoms, sounds, smells, warning lights, environmental factor, and recent repairs(Provide an error code if available).'>

          </textarea>
          <button type="button" onClick={startListening} className={isListening ? 'listening' : ''} id='microphone'>
            <i className="fa-solid fa-microphone"></i>

          </button>

        </div>

        {suggestions.length > 0 && (
          <div className="suggestions visible">
            <strong>Suggestions:</strong>
            <ul>
              {suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
        )}

        <button className={loading ? 'loading' : ''} disabled={loading}>{loading ? "Checking..." : "CAR CHECK"}</button>
      </form>
      {
        carSolution && (<div className="solutionDisplay" dangerouslySetInnerHTML={{ __html: carSolution }} />)
      }
      
    </div>
  )
}

export default ProblemCheck