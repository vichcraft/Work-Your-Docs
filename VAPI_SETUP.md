# Vapi Voice Agent Setup

This project integrates with Vapi to provide voice conversation capabilities. Follow these steps to configure it properly.

## 1. Get Vapi API Keys

1. Go to [https://dashboard.vapi.ai](https://dashboard.vapi.ai)
2. Sign up or log in to your account
3. Navigate to the API Keys section
4. Copy your **Public API Key** and **Private API Key**

## 2. Environment Configuration

Create a `.env.local` file in your project root with the following variables:

```env
# Vapi Configuration
VAPI_PRIVATE_API_KEY=your_vapi_private_key_here
NEXT_PUBLIC_VAPI_PUBLIC_KEY=your_vapi_public_key_here

# Optional: If you have a specific assistant configured in Vapi dashboard
NEXT_PUBLIC_VAPI_ASSISTANT_ID=your_assistant_id_here
```

## 3. Assistant Configuration (Optional)

If you want to use a pre-configured assistant from your Vapi dashboard:

1. Go to your Vapi dashboard
2. Create a new assistant or select an existing one
3. Copy the Assistant ID
4. Add it to your `.env.local` as `NEXT_PUBLIC_VAPI_ASSISTANT_ID`

If you don't provide an Assistant ID, the app will use the inline configuration with:
- Model: GPT-4 (OpenAI)
- Voice: Jennifer (PlayHT)
- System prompt for helpful voice assistance

## 4. Testing

1. Run your development server: `npm run dev`
2. Open the app in your browser
3. Click the microphone button to start a voice conversation
4. Allow microphone permissions when prompted
5. Speak naturally - the conversation will appear in the chat interface

## Features

- **Text Chat**: Type messages and get streaming responses
- **Voice Chat**: Click the microphone to start/end voice calls
- **Real-time Transcription**: See your spoken words and AI responses in the chat
- **Visual Status**: Clear indicators for call status (connecting, active, ended)
- **Seamless Switching**: Use both text and voice in the same conversation

## Troubleshooting

### "Vapi is not configured" error
- Check that `NEXT_PUBLIC_VAPI_PUBLIC_KEY` is set in your `.env.local`
- Restart your development server after adding environment variables

### Voice calls not connecting
- Verify your Vapi API keys are correct
- Check browser console for error messages
- Ensure microphone permissions are granted
- Try using an Assistant ID from your Vapi dashboard

### No response from voice calls
- Check that your Vapi account has sufficient credits
- Verify your assistant configuration in the Vapi dashboard
- Look at the browser network tab for failed API calls

## Need Help?

- Check the [Vapi Documentation](https://docs.vapi.ai/)
- Visit the [Vapi Discord Community](https://discord.gg/vapi)
- Review the browser console for error messages
