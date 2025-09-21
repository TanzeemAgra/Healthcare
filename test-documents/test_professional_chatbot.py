#!/usr/bin/env python3
"""
Enhanced Dr. Max Chatbot Professional Medical Testing
Test the enhanced chatbot with medical exam preparation questions
"""
import asyncio
import websockets
import json
import time

async def test_professional_chatbot():
    """Test the enhanced professional medical chatbot"""
    
    print("🧪 Testing Enhanced Dr. Max AI Chatbot")
    print("=" * 50)
    
    # Professional medical questions for testing
    test_questions = [
        "What is myocardial infarction and what are its key symptoms?",
        "Explain the pathophysiology of Type 2 diabetes mellitus",
        "What is the differential diagnosis for acute chest pain?",
        "Describe the mechanism of action of ACE inhibitors",
        "What are the stages of chronic kidney disease?"
    ]
    
    try:
        # Connect to WebSocket server
        uri = "ws://localhost:5161/?userId=test_user&roomId=medical_test"
        print(f"🔌 Connecting to: {uri}")
        
        async with websockets.connect(uri) as websocket:
            print("✅ Connected to Dr. Max AI WebSocket server")
            
            # Listen for initial connection message
            try:
                initial_msg = await asyncio.wait_for(websocket.recv(), timeout=5)
                data = json.loads(initial_msg)
                print(f"📡 Server: {data.get('text', 'Connection established')}")
            except asyncio.TimeoutError:
                print("⚠️  No initial message received (this is normal)")
            
            # Test each professional medical question
            for i, question in enumerate(test_questions, 1):
                print(f"\n📝 Test {i}: {question}")
                print("-" * 60)
                
                # Send question
                message = {
                    "type": "message",
                    "message": question,
                    "roomId": "medical_test",
                    "userId": "test_user"
                }
                
                await websocket.send(json.dumps(message))
                print(f"📤 Sent: {question}")
                
                # Collect response
                response_text = ""
                start_time = time.time()
                
                while True:
                    try:
                        response = await asyncio.wait_for(websocket.recv(), timeout=15)
                        data = json.loads(response)
                        
                        if data["type"] == "llm_response_start":
                            print("🤖 Dr. Max is responding...")
                            response_text = data.get("initial_text", "")
                            
                        elif data["type"] == "llm_response_chunk":
                            response_text += data.get("delta", "")
                            
                        elif data["type"] == "llm_response_end":
                            print("📋 Complete Response:")
                            print("=" * 40)
                            print(response_text)
                            print("=" * 40)
                            
                            # Analyze response quality
                            analysis = analyze_response_quality(response_text)
                            print(f"📊 Response Analysis: {analysis}")
                            break
                            
                        elif data["type"] == "error":
                            print(f"❌ Error: {data.get('message', 'Unknown error')}")
                            break
                            
                    except asyncio.TimeoutError:
                        print("⏰ Response timeout - moving to next question")
                        break
                    except json.JSONDecodeError:
                        print("⚠️  Received non-JSON response")
                        continue
                
                # Wait before next question
                if i < len(test_questions):
                    print("⏳ Waiting 3 seconds before next question...")
                    await asyncio.sleep(3)
            
            print("\n🎉 Professional Medical Chatbot Testing Complete!")
            print("=" * 50)
            
    except ConnectionRefusedError:
        print("❌ Error: Cannot connect to WebSocket server")
        print("   Make sure the chatbot server is running on localhost:5161")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")

def analyze_response_quality(response):
    """Analyze the quality of medical response"""
    quality_indicators = {
        "Professional": any(indicator in response for indicator in ["**", "Medical", "Clinical", "Patient"]),
        "Structured": any(indicator in response for indicator in ["1.", "•", "-", "**"]),
        "Educational": any(indicator in response for indicator in ["pathophysiology", "mechanism", "diagnosis", "treatment"]),
        "Comprehensive": len(response.split()) > 50,
        "Medical_Terms": any(term in response.lower() for term in ["syndrome", "disease", "condition", "therapy", "diagnosis"])
    }
    
    score = sum(quality_indicators.values())
    total = len(quality_indicators)
    
    return f"{score}/{total} indicators met - {'Excellent' if score >= 4 else 'Good' if score >= 3 else 'Needs Improvement'}"

if __name__ == "__main__":
    asyncio.run(test_professional_chatbot())
