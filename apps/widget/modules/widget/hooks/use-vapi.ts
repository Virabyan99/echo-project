import Vapi from '@vapi-ai/web'
import { useEffect, useState } from 'react'

interface TranscriptMessage {
  role: 'user' | 'assistant'
  text: string
}

export const useVapi = () => {
  const [vapi, setVapi] = useState<Vapi | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([])

  useEffect(() => {
    // Only for testing vapi api
    const vapiInstance = new Vapi('83a1ecab-46ae-4740-a23f-8a7c281a0353')
    setVapi(vapiInstance)

    vapiInstance.on('call-start', () => {
      setIsConnecting(true)
      setIsConnecting(false)
      setTranscript([])
    })

    vapiInstance.on('call-end', () => {
      setIsConnected(false)
      setIsConnecting(false)
      setIsSpeaking(false)
    })

    vapiInstance.on('speech-start', () => {
      setIsSpeaking(true)
    })

    vapiInstance.on('speech-end', () => {
      setIsSpeaking(false)
    })

    vapiInstance.on('error', (error) => {
      console.log('VAPI_ERROR', error)
      setIsConnected(false)
    })

    vapiInstance.on('message', (message) => {
      if (message.type === 'transcript' && message.transcriptType === 'final') {
        setTranscript((prev) => [
          ...prev,
          {
            role: message.role === 'user' ? 'user' : 'assistant',
            text: message.transcript,
          },
        ])
      }
    })

    return () => {
        vapiInstance?.stop()
    }
  }, [])

  const startCall = () => {
    setIsConnecting(true)

    if(vapi) {
        vapi.start("6996ddbe-23e5-46e1-bd03-b2088bfb1e91")
    }
  }

  const endCall = () => {
    if(vapi) {
        vapi.stop()
    }
  }

  return {
    isConnected,
    isConnecting,
    isSpeaking,
    transcript,
    startCall,
    endCall
  }
}
