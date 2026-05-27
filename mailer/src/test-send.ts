import fetch from 'node-fetch';

const origin = process.argv[2];
const language = process.argv[3] || 'en-gb';

if (!origin) {
  console.error('Please provide an origin and optionally a language.');
  console.error('Usage: yarn test-sending <origin> [language]');
  console.error('Example: yarn test-sending pixeau.nl nl-nl');
  process.exit(1);
}

const testEmail = async (origin: string, language: string) => {
  try {
    const response = await fetch('http://localhost:8787', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': `https://${origin}`
      },
      body: JSON.stringify({
        email: 'test@example.com',
        name: 'Test User',
        message: 'This is a test message that needs to be at least 40 characters long to meet the minimum length requirement.',
        language
      })
    });

    const status = response.status;
    const text = await response.text();

    console.log('Status:', status);
    console.log('Response:', text);

    if (status === 200) {
      console.log('\n✅ Test email sent successfully');
    } else {
      console.log('\n❌ Failed to send test email');
    }
  } catch (error) {
    console.error('\n❌ Error:', error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
};

testEmail(origin, language);
