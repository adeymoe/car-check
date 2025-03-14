import React, { useState } from 'react'

const KnowYourCar = () => {

    const [carName, setCarName] = useState("")
    const [carDetails, setCarDetails] = useState("")
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        getDetails(carName);
    };

    const getDetails = async (carName) => {
        if (carName.trim() === "") {
            alert("No Text Entered");
            return;
        }


        //   const prompt = `What do i need to know about this vehicle ${carName}, Make the response clear, concise, and easy to understand,  return a response format that will look good inside a div`
        const prompt = `Provide a detailed yet easy-to-understand analysis of the following vehicle:

Vehicle Name: ${carName}

Instructions:
- Give a brief overview of the vehicle, including its class, purpose, and key features.
- Highlight the most notable specifications (engine type, horsepower, fuel efficiency, safety features, etc.).
- List common strengths and weaknesses of this model.
- Mention any known reliability issues or recalls (if applicable).
- Suggest who this car is best suited for (e.g., families, off-roaders, city drivers).
- Provide maintenance tips to keep the vehicle in top condition.
- Indicate the estimated cost range for purchase and ownership (fuel, repairs, insurance, etc.).

Output Format:

🚗 **Vehicle Overview:** [Brief introduction]
⚙️ **Key Specifications:** [List of major specs]
✅ **Strengths:** [Bullet list of positives]
⚠️ **Weaknesses:** [Bullet list of concerns]
🔧 **Reliability & Known Issues:** [Common problems, if any]
👤 **Best For:** [Ideal user category]
🛠 **Maintenance Tips:** [Advice to keep it running well]
💰 **Cost Estimates:** [Price range & ownership expenses]

Make the response clear, concise, and easy to understand, return a response format that will look good inside a div by putting appropriate tags in each line`;

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
                setCarDetails(data.candidates[0].content.parts[0].text);
                setLoading(false);
            } else {
                setCarDetails("Look for help!");
                setLoading(false);
            }
        } catch (error) {
            console.error("Error checking post:", error);
            setCarDetails("Failed to perform check");
            setLoading(false);
        }
    }

    return (
        <div className='knowYourCar'>
            <form onSubmit={handleSubmit}>
                <input className='carNameInput' value={carName} onChange={(e) => setCarName(e.target.value)} type="text" placeholder='Input car name' />
                <button type='submit' className={loading ? 'loading' : ''} disabled={loading}>{loading ? "Checking..." : "KNOW YOUR RIDE"}</button>
            </form>
            {carDetails && (<div className='vehicle-info' dangerouslySetInnerHTML={{ __html: carDetails }} />)}
        </div>
    )
}

export default KnowYourCar