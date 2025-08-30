#!/usr/bin/env python3
"""
Test script for the ML Model API
Run this after deployment to verify everything is working
"""

import requests
import json
import time
import sys

# Configuration
BASE_URL = "http://localhost:5000"
HEALTH_ENDPOINT = f"{BASE_URL}/health"
SCHEMES_ENDPOINT = f"{BASE_URL}/schemes"

def test_health():
    """Test the health endpoint"""
    print("🏥 Testing health endpoint...")
    try:
        response = requests.get(HEALTH_ENDPOINT, timeout=10)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Health check passed: {data}")
            return data.get('model_loaded', False) and data.get('data_loaded', False)
        else:
            print(f"❌ Health check failed with status {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Health check failed: {e}")
        return False

def test_schemes_endpoint():
    """Test the schemes recommendation endpoint"""
    print("\n🔍 Testing schemes endpoint...")
    
    test_cases = [
        {
            "prompt": "I am a poor farmer looking for financial assistance",
            "k": 3
        },
        {
            "prompt": "I need help with education for my children",
            "k": 2
        },
        {
            "prompt": "I want to start a small business",
            "k": 4
        }
    ]
    
    for i, test_case in enumerate(test_cases, 1):
        print(f"\n📝 Test case {i}: {test_case['prompt']}")
        try:
            response = requests.post(
                SCHEMES_ENDPOINT,
                json=test_case,
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success'):
                    schemes = data.get('data', [])
                    print(f"✅ Got {len(schemes)} recommendations")
                    for j, scheme in enumerate(schemes, 1):
                        print(f"   {j}. {scheme.get('scheme_name', 'N/A')}")
                        print(f"      Category: {scheme.get('schemeCategory', 'N/A')}")
                        print(f"      Benefits: {scheme.get('benefits', 'N/A')[:100]}...")
                else:
                    print(f"❌ API returned error: {data.get('error', 'Unknown error')}")
            else:
                print(f"❌ Request failed with status {response.status_code}")
                print(f"   Response: {response.text}")
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Request failed: {e}")

def test_get_endpoint():
    """Test the GET endpoint with URL parameter"""
    print("\n🌐 Testing GET endpoint...")
    
    test_text = "I need housing assistance"
    endpoint = f"{BASE_URL}/schemes/{test_text.replace(' ', '%20')}"
    
    try:
        response = requests.get(endpoint, timeout=30)
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                schemes = data.get('data', [])
                print(f"✅ GET endpoint working: {len(schemes)} recommendations")
            else:
                print(f"❌ GET endpoint error: {data.get('error', 'Unknown error')}")
        else:
            print(f"❌ GET endpoint failed with status {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"❌ GET endpoint failed: {e}")

def main():
    """Main test function"""
    print("🚀 ML Model API Test Suite")
    print("=" * 50)
    
    # Wait a bit for service to be ready
    print("⏳ Waiting for service to be ready...")
    time.sleep(5)
    
    # Test health endpoint
    if not test_health():
        print("\n❌ Service is not healthy. Please check deployment.")
        sys.exit(1)
    
    # Test schemes endpoint
    test_schemes_endpoint()
    
    # Test GET endpoint
    test_get_endpoint()
    
    print("\n🎉 All tests completed!")
    print("\n📊 API Summary:")
    print(f"   Health: {BASE_URL}/health")
    print(f"   Schemes: {BASE_URL}/schemes")
    print(f"   GET: {BASE_URL}/schemes/{{text}}")

if __name__ == "__main__":
    main()
