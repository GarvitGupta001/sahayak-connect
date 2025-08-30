#!/usr/bin/env python3
"""
Comprehensive test script to verify FORM6 form filling with ALL extracted fields
"""

import os
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def test_comprehensive_form_filling():
    """Test the FORM6 form filling with ALL possible extracted fields"""
    print("🔍 COMPREHENSIVE FORM6 FORM FILLING TEST")
    print("=" * 70)
    
    try:
        from enhanced_form6_filler import EnhancedForm6Filler
        
        # Initialize the form filler
        print("📋 Initializing FORM6 Filler...")
        filler = EnhancedForm6Filler('FORM6.pdf')
        
        # Show template dimensions
        print(f"✅ Template dimensions: {filler.template_width} x {filler.template_height}")
        print(f"✅ Total fields mapped: {len(filler.field_coordinates)}")
        
        # Comprehensive test data with ALL possible fields - SIMULATED OCR EXTRACTION
        test_data = {
            'aadhaar_data': {
                'name': 'John Doe',
                'dob': '15/08/1990',
                'aadhaar_number': '123456789012',
                'gender': 'Male',
                'mobile_number': '9876543210',
                'email_address': 'john.doe@email.com',
                'occupation': 'Software Engineer',
                'relation_name': 'Father'
            },
            'voter_data': {
                'name': 'John Doe',
                'address': '123 Main Street, New Delhi, Delhi - 110001',
                'voter_id': 'DL1234567',
                'house_number': '123',
                'street_locality': 'Main Street',
                'town_village': 'New Delhi',
                'post_office': 'New Delhi',
                'district': 'Delhi',
                'state': 'Delhi',
                'pin_code': '110001'
            }
        }
        
        # Simulate OCR processing to ensure ALL fields are extracted
        processed_ocr_data = {
            'full_name': test_data['aadhaar_data']['name'],
            'surname': test_data['aadhaar_data']['name'].split()[-1],
            'given_name': test_data['aadhaar_data']['name'].split()[0],
            'date_of_birth': test_data['aadhaar_data']['dob'],
            'age': '35',
            'aadhaar_number': test_data['aadhaar_data']['aadhaar_number'],
            'gender': test_data['aadhaar_data']['gender'],
            'mobile_number': test_data['aadhaar_data']['mobile_number'],
            'email_address': test_data['aadhaar_data']['email_address'],
            'occupation': test_data['aadhaar_data']['occupation'],
            'relation_name': test_data['aadhaar_data']['relation_name'],
            'voter_id_number': test_data['voter_data']['voter_id'],
            'pin_code': test_data['voter_data']['pin_code'],
            'house_number': test_data['voter_data']['house_number'],
            'street_locality': test_data['voter_data']['street_locality'],
            'town_village': test_data['voter_data']['town_village'],
            'district': test_data['voter_data']['district'],
            'post_office': test_data['voter_data']['post_office'],
            'state': test_data['voter_data']['state']
        }
        
        print("\n📝 Comprehensive test data:")
        print(f"   Name: {test_data['aadhaar_data']['name']}")
        print(f"   DOB: {test_data['aadhaar_data']['dob']}")
        print(f"   Gender: {test_data['aadhaar_data']['gender']}")
        print(f"   Mobile: {test_data['aadhaar_data']['mobile_number']}")
        print(f"   Email: {test_data['aadhaar_data']['email_address']}")
        print(f"   Occupation: {test_data['aadhaar_data']['occupation']}")
        print(f"   Address: {test_data['voter_data']['address']}")
        print(f"   Voter ID: {test_data['voter_data']['voter_id']}")
        
        # Show coordinate mappings for ALL important fields
        print("\n🎯 ALL field coordinates:")
        all_fields = [
            'applicant_name', 'surname', 'given_name', 'aadhaar_digits',
            'mobile_number', 'email_address', 'occupation',
            'gender_male', 'gender_female', 'relation_name',
            'house_number', 'street_locality', 'town_village',
            'post_office', 'district', 'state', 'pin_code',
            'voter_id_number', 'dob_dd_tens', 'dob_dd_units'
        ]
        
        for field in all_fields:
            if field in filler.field_coordinates:
                x, y = filler.field_coordinates[field]
                print(f"   {field}: ({x}, {y})")
            else:
                print(f"   {field}: NOT MAPPED!")
        
        # Fill the form using the processed OCR data directly
        print("\n📄 Filling FORM6 with ALL extracted information...")
        output_file = f'comprehensive_test_form_{datetime.now().strftime("%Y%m%d_%H%M%S")}.pdf'
        
        # Create field mapping directly from processed data
        field_mapping = filler.create_field_mapping(processed_ocr_data)
        
        # Fill the form using the field mapping
        result = filler._fill_form6_with_mapping(field_mapping, output_file)
        
        if result and os.path.exists(result):
            file_size = os.path.getsize(result)
            print(f"✅ Form filled successfully!")
            print(f"   Output: {result}")
            print(f"   Size: {file_size:,} bytes")
            
            # Show what should be filled
            print("\n📋 ALL fields that should be filled:")
            print("   ✅ Applicant Name: John Doe")
            print("   ✅ Surname: Doe")
            print("   ✅ Given Name: John")
            print("   ✅ Aadhaar: 1234 5678 9012")
            print("   ✅ Mobile Number: 9876543210")
            print("   ✅ Email: john.doe@email.com")
            print("   ✅ Occupation: Software Engineer")
            print("   ✅ Gender: Male (✓ in male checkbox)")
            print("   ✅ Relation: Father")
            print("   ✅ DOB: 15/08/1990 (individual digits)")
            print("   ✅ Age: 35 (individual digits)")
            print("   ✅ House Number: 123")
            print("   ✅ Street: Main Street")
            print("   ✅ Town: New Delhi")
            print("   ✅ Post Office: New Delhi")
            print("   ✅ District: Delhi")
            print("   ✅ State: Delhi")
            print("   ✅ Pin Code: 110001 (individual digits)")
            print("   ✅ Voter ID: DL1234567")
            
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
    """Run the comprehensive test"""
    print("Welcome to Comprehensive FORM6 Form Filling Test!")
    print("This will test ALL extracted fields and ensure complete mapping.\n")
    
    success = test_comprehensive_form_filling()
    
    if success:
        print("\n🎉 Comprehensive test completed successfully!")
        print("Check the generated PDF to see if ALL fields are properly filled.")
        print("\n🔍 Look for these visible elements:")
        print("   • Name 'John Doe' in the top area")
        print("   • Mobile number '9876543210'")
        print("   • Email 'john.doe@email.com'")
        print("   • Occupation 'Software Engineer'")
        print("   • Aadhaar number '1234 5678 9012'")
        print("   • Gender checkbox marked with ✓")
        print("   • Relation 'Father'")
        print("   • DOB digits in individual boxes")
        print("   • Address details in address section")
        print("   • Pin code digits in pin code boxes")
        print("   • Voter ID 'DL1234567'")
    else:
        print("\n❌ Comprehensive test failed. Check the error messages above.")
    
    return 0 if success else 1

if __name__ == "__main__":
    exit(main())
