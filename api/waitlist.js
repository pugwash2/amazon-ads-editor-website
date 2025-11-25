// Vercel Serverless Function to handle waitlist submissions
export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email } = req.body;

    // Validate email
    if (!email || !email.includes('@')) {
        return res.status(400).json({ error: 'Invalid email' });
    }

    try {
        // Submit to Google Forms from the server (bypasses CORS)
        const formData = new URLSearchParams();
        formData.append('entry.1157407193', email);

        const response = await fetch(
            'https://docs.google.com/forms/d/e/1FAIpQLScXgqv7fOPr8STHRkmsG2jgtWXNVKwovtKl1ZT74qK6tF5aSA/formResponse',
            {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        // Google Forms returns a redirect, which is success
        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error submitting to Google Forms:', error);
        return res.status(500).json({ error: 'Submission failed' });
    }
}
