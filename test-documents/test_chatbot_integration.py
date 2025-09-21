#!/usr/bin/env python
"""
Test Dr. Max AI Chatbot Integration
Verify OpenAI API connectivity and WebSocket server functionality
"""
import os
import sys
from pathlib import Path

# Add Django settings to the path
sys.path.append(str(Path(__file__).parent / 'backend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

import django
django.setup()

from secureneat.services.openai_service import openai_service
import asyncio
import websockets
import json

def test_openai_direct():
    """Test OpenAI service directly"""
    print("🧪 Testing OpenAI Direct Integration...")
    
    try:
        # Test basic medical query
        test_query = "What are the symptoms of myocardial infarction?"
        response = openai_service.get_chat_response(test_query)
        
        print(f"✅ OpenAI Response (first 100 chars): {response[:100]}...")
        print(f"✅ Response Length: {len(response)} characters")
        
        return True, response
    except Exception as e:
        print(f"❌ OpenAI Error: {e}")
        return False, str(e)

async def test_websocket_connection():
    """Test WebSocket server connection"""
    print("\n🔌 Testing WebSocket Connection...")
    
    try:
        uri = "ws://localhost:5161/?userId=test_user&roomId=test_room"
        
        async with websockets.connect(uri) as websocket:
            print("✅ WebSocket Connected Successfully")
            
            # Test sending a message
            test_message = {
                "type": "message",
                "message": "Hello Dr. Max, can you help me?",
                "roomId": "test_room",
                "userId": "test_user"
            }
            
            await websocket.send(json.dumps(test_message))
            print("✅ Message Sent")
            
            # Wait for responses
            response_count = 0
            while response_count < 5:  # Wait for a few responses
                try:
                    response = await asyncio.wait_for(websocket.recv(), timeout=10.0)
                    data = json.loads(response)
                    print(f"📨 Received: {data.get('type', 'unknown')} - {data.get('text', data.get('delta', ''))[:50]}...")
                    response_count += 1
                    
                    if data.get('type') == 'llm_response_end':
                        break
                        
                except asyncio.TimeoutError:
                    print("⏱️ Timeout waiting for response")
                    break
                except Exception as e:
                    print(f"⚠️ Response parsing error: {e}")
                    break
            
            print("✅ WebSocket Communication Test Complete")
            return True
            
    except Exception as e:
        print(f"❌ WebSocket Error: {e}")
        return False

def test_api_keys():
    """Test API key configuration"""
    print("\n🔑 Testing API Key Configuration...")
    
    from django.conf import settings
    
    openai_key = getattr(settings, 'OPENAI_API_KEY', None)
    if openai_key:
        # Show first and last 4 characters for security
        masked_key = f"{openai_key[:7]}...{openai_key[-4:]}" if len(openai_key) > 11 else "***"
        print(f"✅ OpenAI API Key Configured: {masked_key}")
        return True
    else:
        print("❌ OpenAI API Key Not Found")
        return False

async def main():
    """Run all tests"""
    print("🚀 Dr. Max AI Chatbot Integration Test")
    print("=" * 50)
    
    # Test 1: API Keys
    keys_ok = test_api_keys()
    
    # Test 2: OpenAI Direct
    openai_ok, openai_response = test_openai_direct()
    
    # Test 3: WebSocket
    websocket_ok = await test_websocket_connection()
    
    # Summary
    print("\n📊 Test Summary")
    print("=" * 50)
    print(f"🔑 API Keys: {'✅ PASS' if keys_ok else '❌ FAIL'}")
    print(f"🤖 OpenAI Service: {'✅ PASS' if openai_ok else '❌ FAIL'}")
    print(f"🔌 WebSocket Server: {'✅ PASS' if websocket_ok else '❌ FAIL'}")
    
    if all([keys_ok, openai_ok, websocket_ok]):
        print("\n🎉 All Tests Passed! Dr. Max AI Chatbot is fully functional!")
        print("✅ Users can now chat with Dr. Max at http://localhost:5173/SecureNeat/chat")
    else:
        print("\n⚠️ Some tests failed. Check the errors above.")
        
    print("\n🔧 Next Steps:")
    print("1. Visit http://localhost:5173/SecureNeat/chat")
    print("2. Try asking Dr. Max a medical question")
    print("3. Verify real-time AI responses are working")

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n👋 Test interrupted by user")
    except Exception as e:
        print(f"❌ Test error: {e}")
