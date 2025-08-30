#!/usr/bin/env python3
"""
Simple test script to verify FORM6 form filling with corrected coordinates
"""

import os
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def test_simple_form_filling():
    """Test the FORM6 form filling with corrected coordinates"""
    print("🔍 SIMPLE FORM6 FORM FILLING TEST")
    print("=" * 50)
    
    try:
        from enhanced_form6_filler import EnhancedForm6Filler
        
        # Initialize the form filler
        print("📋 Initializing FORM6 Filler...")
        filler = EnhancedForm6Filler('FORM6.pdf')
        
        # Show template dimensions
        print(f"✅ Template dimensions: {filler.template_width} x {filler.template_height}")
        print(f"✅ Total fields mapped: {len(filler.field_coordinates)}")
        
        # Simple test data
        test_data = {
            'aadhaar_data': {
                'name': 'John Doe',
                'dob': '15/08/1990',
                'aadhaar_number': '123456789012',
                'gender': 'Male'
            },
            'voter_data': {
                'name': 'John Doe',
                'address': '123 Main Street, New Delhi, Delhi - 110001',
                'voter_id': 'DL1234567'
            }
        }
        
        print("\n📝 Test data:")
        print(f"   Name: {test_data['aadhaar_data']['name']}")
        print(f"   DOB: {test_data['aadhaar_data']['dob']}")
        print(f"   Gender: {test_data['aadhaar_data']['gender']}")
        print(f"   Address: {test_data['voter_data']['address']}")
        
        # Show coordinate mappings for important fields
        print("\n🎯 Important field coordinates:")
        important_fields = [
            'applicant_name', 'surname', 'given_name', 'aadhaar_digits',
            'gender_male', 'house_number', 'street_locality', 'pin_code'
        ]
        
        for field in important_fields:
            if field in filler.field_coordinates:
                x, y = filler.field_coordinates[field]
                print(f"   {field}: ({x}, {y})")
            else:
                print(f"   {field}: NOT MAPPED!")
        
        # Fill the form
        print("\n📄 Filling FORM6 with corrected coordinates...")
        output_file = f'simple_test_form_{datetime.now().strftime("%Y%m%d_%H%M%S")}.pdf'
        
        result = filler.fill_form6_enhanced(test_data, output_file)
        
        if result and os.path.exists(result):
            file_size = os.path.getsize(result)
            print(f"✅ Form filled successfully!")
            print(f"   Output: {result}")
            print(f"   Size: {file_size:,} bytes")
            
            return True
        else:
            print("❌ Form filling failed")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    """Run the simple test"""
    print("Welcome to Simple FORM6 Form Filling Test!")
    print("This will test the corrected coordinates.\n")
    
    success = test_simple_form_filling()
    
    if success:
        print("\n🎉 Simple test completed successfully!")
        print("Check the generated PDF to see if fields are properly positioned.")
    else:
        print("\n❌ Simple test failed. Check the error messages above.")
    
    return 0 if success else 1

if __name__ == "__main__":
    exit(main())
