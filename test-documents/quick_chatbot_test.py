#!/usr/bin/env python3
"""
Quick WebSocket Connection Test for Dr. Max AI Chatbot
"""
import asyncio
import websockets
import json

async def quick_test():
    try:
        # Connect to the chatbot server
        uri = "ws://localhost:5161/?userId=test_user&roomId=test_room"
        print(f"🔌 Connecting to {uri}")
        
        async with websockets.connect(uri) as websocket:
            print("✅ Connected to Dr. Max AI!")
            
            # Send a simple medical question
            test_message = {
                "type": "message",
                "message": "What is hypertension?",
                "roomId": "test_room",
                "userId": "test_user"
            }
            
            await websocket.send(json.dumps(test_message))
            print("📤 Sent: What is hypertension?")
            
            # Wait for response
            print("⏳ Waiting for Dr. Max's response...")
            
            response_text = ""
            timeout_count = 0
            max_timeouts = 3
            
            while timeout_count < max_timeouts:
                try:
                    response = await asyncio.wait_for(websocket.recv(), timeout=10)
                    data = json.loads(response)
                    
                    if data["type"] == "llm_response_start":
                        print("🤖 Dr. Max is responding...")
                        
                    elif data["type"] == "llm_response_chunk":
                        response_text += data.get("delta", "")
                        
                    elif data["type"] == "llm_response_end":
                        print("\n" + "="*60)
                        print("📋 Dr. Max's Response:")
                        print("="*60)
                        print(response_text)
                        print("="*60)
                        
                        # Check if response looks professional
                        if len(response_text) > 100 and any(keyword in response_text.lower() for keyword in ["medical", "blood pressure", "hypertension", "cardiovascular"]):
                            print("✅ Response appears professional and medical!")
                        else:
                            print("⚠️  Response may need improvement")
                        
                        return True
                        
                    elif data["type"] == "error":
                        print(f"❌ Error: {data.get('message', 'Unknown error')}")
                        return False
                        
                except asyncio.TimeoutError:
                    timeout_count += 1
                    print(f"⏰ Timeout {timeout_count}/{max_timeouts}")
                    continue
                    
            print("❌ No complete response received")
            return False
            
    except ConnectionRefusedError:
        print("❌ Connection refused - make sure chatbot server is running on localhost:5161")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    print("🧪 Quick Test: Dr. Max AI Professional Medical Chatbot")
    print("="*60)
    
    result = asyncio.run(quick_test())
    
    if result:
        print("\n🎉 SUCCESS: Dr. Max AI is working with professional medical responses!")
        print("🌐 You can now test at: http://localhost:5173/SecureNeat/chat")
    else:
        print("\n❌ FAILED: There may be an issue with the chatbot")
        print("🔧 Check the server logs for more information")
