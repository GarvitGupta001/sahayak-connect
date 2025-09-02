"""
Enhanced FORM6 Filler System
Optimized form filling with precise field mapping, advanced validation, and better OCR handling
"""

import logging
import os
import re
from PyPDF2 import PdfReader, PdfWriter
from datetime import datetime, date
import io
from typing import Dict, List, Optional, Tuple, Any

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('form6_filler.log'),
        logging.StreamHandler()
    ]
)

try:
    from reportlab.pdfgen import canvas
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.colors import black, red
    from reportlab.pdfbase import pdfmetrics
    from reportlab.pdfbase.ttfonts import TTFont
    REPORTLAB_AVAILABLE = True
except ImportError:
    REPORTLAB_AVAILABLE = False
    logging.warning("ReportLab not available. Will use basic PDF overlay method.")


class EnhancedForm6Filler:
    """Enhanced FORM6 filler with optimized field mapping and validation"""
    
    def __init__(self, template_path='FORM6.pdf'):
        self.template_path = template_path
        if not os.path.exists(template_path):
            raise FileNotFoundError(f"Template PDF not found: {template_path}")
        
        # Get template dimensions
        self.template_width, self.template_height = self._get_template_dimensions()
        
        # Enhanced coordinate mappings with improved precision
        # Based on detailed analysis of FORM6.pdf layout
        self.field_coordinates = self._get_enhanced_coordinates()
        
        # Initialize enhanced data processors
        self.ocr_processor = EnhancedOCRProcessor()
        self.data_validator = FormDataValidator()
        self.mapping_engine = FieldMappingEngine()
        
        logging.info(f"Enhanced FORM6 Filler initialized with template: {template_path}")
        logging.info(f"Template dimensions: {self.template_width} x {self.template_height}")
    
    def _get_template_dimensions(self) -> Tuple[float, float]:
        """Get the actual dimensions of the template PDF"""
        try:
            reader = PdfReader(self.template_path)
            if reader.pages:
                page = reader.pages[0]
                width = float(page.mediabox.width)
                height = float(page.mediabox.height)
                return width, height
        except Exception as e:
            logging.warning(f"Could not read template dimensions: {e}")
        
        # Default to FORM6 dimensions if reading fails
        return 612.0, 792.0
    
    def _get_enhanced_coordinates(self) -> Dict[str, Tuple[float, float]]:
        """Get enhanced coordinate mappings for FORM6 fields - EXACT positions from actual form"""
        return {
            # Basic Information - EXACT coordinates from FORM6
            'applicant_name': (100, 680),           # (a) Name field - where "Aieaht" appears
            'surname': (100, 650),                  # (b) Surname field - where "9696 3259 1947" appears
            'given_name': (100, 620),               # Given name field
            
            # Aadhaar number field
            'aadhaar_digits': (100, 590),           # Aadhaar number field
            
            # Mobile number field - ADDED
            'mobile_number': (100, 560),            # Mobile number field
            
            # Relation Information - EXACT positions
            'father_checkbox': (150, 530),          # Father checkbox
            'mother_checkbox': (220, 530),          # Mother checkbox
            'husband_checkbox': (290, 530),         # Husband checkbox
            'wife_checkbox': (360, 530),            # Wife checkbox
            'relation_name': (100, 500),            # (c) Relative name field
            
            # Age and DOB - EXACT positions from form
            'age_years_tens': (150, 470),           # Age years tens digit
            'age_years_units': (170, 470),          # Age years units digit
            'age_months_tens': (210, 470),          # Age months tens digit
            'age_months_units': (230, 470),         # Age months units digit
            
            # Date of Birth individual boxes - EXACT positions
            'dob_dd_tens': (150, 440),              # Day tens
            'dob_dd_units': (170, 440),             # Day units
            'dob_mm_tens': (210, 440),              # Month tens
            'dob_mm_units': (230, 440),             # Month units
            'dob_yyyy_thousands': (270, 440),       # Year thousands
            'dob_yyyy_hundreds': (290, 440),        # Year hundreds
            'dob_yyyy_tens': (310, 440),            # Year tens
            'dob_yyyy_units': (330, 440),           # Year units
            
            # Gender - EXACT positions from form
            'gender_male': (150, 410),              # Male checkbox
            'gender_female': (220, 410),            # Female checkbox
            'gender_third': (290, 410),             # Third gender checkbox
            
            # Current Address fields - EXACT positions from form
            'house_number': (100, 380),             # (h) House number - where "1900" appears
            'street_locality': (100, 350),          # (h) Street/Area/Locality - where "12092005" appears
            'town_village': (100, 320),             # (h) Town/Village - empty in form
            'post_office': (100, 290),              # (h) Post Office - has ✓ in form
            'district': (100, 260),                 # (h) District - where "409" appears
            'state': (100, 230),                    # (h) State/UT - empty in form
            
            # Pin Code individual boxes - EXACT positions
            'pin_code': (100, 200),                 # Pin code field (for general use)
            'pin_1': (150, 200),                    # Pin digit 1
            'pin_2': (170, 200),                    # Pin digit 2
            'pin_3': (190, 200),                    # Pin digit 3
            'pin_4': (210, 200),                    # Pin digit 4
            'pin_5': (230, 200),                    # Pin digit 5
            'pin_6': (250, 200),                    # Pin digit 6
            
            # Permanent Address - EXACT positions from form
            'perm_house_no': (100, 170),            # (i) Permanent house number - empty in form
            'perm_street': (100, 140),              # (i) Permanent street - where "DREAM APARTMENT PLOT-14" appears
            'perm_town': (100, 110),                # (i) Permanent town - where "SEC-22 DWARKA" appears
            
            # Additional fields - EXACT positions from form
            'voter_id_number': (100, 80),           # (j) EPIC No. - where "Raj Nagar" appears
            'email_address': (100, 50),             # Email address if available
            'occupation': (100, 20),                # Occupation field
        }
    
    def fill_form6_enhanced(
        self, 
        extracted_data: Dict[str, Any], 
        output_path: str = 'enhanced_filled_form6.pdf'
    ) -> Optional[str]:
        """
        Fill FORM6 with enhanced processing and validation
        
        Args:
            extracted_data: Raw data from OCR processing
            output_path: Output file path
            
        Returns:
            Path to filled form if successful, None otherwise
        """
        try:
            logging.info("Starting enhanced FORM6 filling process")
            
            # Step 1: Process and clean OCR data
            processed_data = self.ocr_processor.process_ocr_data(extracted_data)
            logging.info(f"Processed OCR data: {processed_data}")
            
            # Step 2: Validate processed data
            validation_result = self.data_validator.validate_form_data(processed_data)
            if not validation_result.is_valid:
                logging.warning(f"Data validation warnings: {validation_result.warnings}")
            
            # Step 3: Map data to form fields
            field_mapping = self.mapping_engine.create_field_mapping(processed_data)
            logging.info(f"Created field mapping: {field_mapping}")
            
            # Step 4: Fill the PDF
            if REPORTLAB_AVAILABLE:
                result = self._fill_pdf_with_reportlab(field_mapping, output_path)
            else:
                result = self._fill_pdf_basic_method(field_mapping, output_path)
            
            logging.info(f"Enhanced FORM6 filling completed: {result}")
            return result
            
        except Exception as e:
            logging.error(f"Error in enhanced form filling: {e}")
            return None
    
    def _fill_pdf_with_reportlab(
        self, 
        field_mapping: Dict[str, str], 
        output_path: str
    ) -> Optional[str]:
        """Fill PDF using ReportLab with precise positioning"""
        try:
            # Read original PDF
            reader = PdfReader(self.template_path)
            writer = PdfWriter()
            
            # Process each page
            for page_num, page in enumerate(reader.pages):
                if page_num == 0:  # Main form page
                    overlay_buffer = self._create_enhanced_overlay(field_mapping)
                    
                    if overlay_buffer:
                        overlay_reader = PdfReader(overlay_buffer)
                        overlay_page = overlay_reader.pages[0]
                        page.merge_page(overlay_page)
                
                writer.add_page(page)
            
            # Write final PDF
            with open(output_path, 'wb') as output_file:
                writer.write(output_file)
            
            logging.info(f"Enhanced PDF filled and saved: {output_path}")
            return output_path
            
        except Exception as e:
            logging.error(f"Error filling PDF with ReportLab: {e}")
            return None
    
    def _create_enhanced_overlay(self, field_mapping: Dict[str, str]) -> Optional[io.BytesIO]:
        """Create enhanced overlay with precise text positioning - MAXIMUM visibility for FORM6"""
        try:
            buffer = io.BytesIO()
            # Use the actual template dimensions
            c = canvas.Canvas(buffer, pagesize=(self.template_width, self.template_height))
            
            # Set font and color for MAXIMUM visibility on FORM6
            c.setFont("Helvetica-Bold", 14)  # Larger, bold font for better visibility
            c.setFillColor(black)
            
            # Fill text fields with improved positioning
            for field_name, value in field_mapping.items():
                if field_name in self.field_coordinates and value:
                    x, y = self.field_coordinates[field_name]
                    
                    # Validate coordinates are within template bounds
                    if 0 <= x <= self.template_width and 0 <= y <= self.template_height:
                        if field_name.endswith('_checkbox'):
                            # Draw checkmark for checkboxes - LARGE and VISIBLE
                            c.setFont("Helvetica-Bold", 18)
                            c.drawString(x, y, "✓")
                            c.setFont("Helvetica-Bold", 14)
                        else:
                            # Draw text with proper truncation and positioning
                            text = self._truncate_text(str(value), field_name)
                            # Adjust y position for better text alignment on FORM6
                            adjusted_y = y - 5  # Better text placement for FORM6
                            c.drawString(x, adjusted_y, text)
                            
                            # Add a small rectangle around ALL important fields for debugging
                            if field_name in ['applicant_name', 'surname', 'given_name', 'aadhaar_digits', 'house_number', 'street_locality', 'pin_code', 'mobile_number', 'voter_id_number']:
                                c.setStrokeColor(black)
                                c.rect(x-2, adjusted_y-2, len(text)*8, 18)
                                c.setFillColor(black)
                    else:
                        logging.warning(f"Field {field_name} coordinates ({x}, {y}) out of template bounds ({self.template_width} x {self.template_height})")
            
            # Fill special fields (individual digits/characters)
            self._fill_special_fields(c, field_mapping)
            
            c.save()
            buffer.seek(0)
            return buffer
            
        except Exception as e:
            logging.error(f"Error creating enhanced overlay: {e}")
            return None
    
    def _fill_special_fields(self, canvas_obj, field_mapping: Dict[str, str]):
        """Fill special fields like DOB digits, age digits, pin code digits, etc. - IMPROVED"""
        try:
            # Set font for special fields - LARGER and MORE VISIBLE
            canvas_obj.setFont("Helvetica-Bold", 14)
            
            # Fill DOB individual digits
            dob = field_mapping.get('date_of_birth', '')
            if dob and re.match(r'\d{2}/\d{2}/\d{4}', dob):
                dd, mm, yyyy = dob.split('/')
                
                # Day digits
                if len(dd) >= 2:
                    day_tens_coord = self.field_coordinates.get('dob_dd_tens')
                    day_units_coord = self.field_coordinates.get('dob_dd_units')
                    if day_tens_coord and day_units_coord:
                        canvas_obj.drawString(day_tens_coord[0], day_tens_coord[1] - 4, dd[0])
                        canvas_obj.drawString(day_units_coord[0], day_units_coord[1] - 4, dd[1])
                
                # Month digits
                if len(mm) >= 2:
                    month_tens_coord = self.field_coordinates.get('dob_mm_tens')
                    month_units_coord = self.field_coordinates.get('dob_mm_units')
                    if month_tens_coord and month_units_coord:
                        canvas_obj.drawString(month_tens_coord[0], month_tens_coord[1] - 4, mm[0])
                        canvas_obj.drawString(month_units_coord[0], month_units_coord[1] - 4, mm[1])
                
                # Year digits
                if len(yyyy) >= 4:
                    year_coords = [
                        'dob_yyyy_thousands', 'dob_yyyy_hundreds', 
                        'dob_yyyy_tens', 'dob_yyyy_units'
                    ]
                    for i, coord_key in enumerate(year_coords):
                        coord = self.field_coordinates.get(coord_key)
                        if coord:
                            canvas_obj.drawString(coord[0], coord[1] - 4, yyyy[i])
            
            # Fill age digits
            age = field_mapping.get('age', '')
            if age and age.isdigit():
                age_str = age.zfill(2)  # Ensure 2 digits
                age_tens_coord = self.field_coordinates.get('age_years_tens')
                age_units_coord = self.field_coordinates.get('age_years_units')
                if age_tens_coord and age_units_coord:
                    canvas_obj.drawString(age_tens_coord[0], age_tens_coord[1] - 4, age_str[0])
                    canvas_obj.drawString(age_units_coord[0], age_units_coord[1] - 4, age_str[1])
                
                # Default months to 0
                age_months_tens_coord = self.field_coordinates.get('age_months_tens')
                age_months_units_coord = self.field_coordinates.get('age_months_units')
                if age_months_tens_coord and age_months_units_coord:
                    canvas_obj.drawString(age_months_tens_coord[0], age_months_tens_coord[1] - 4, '0')
                    canvas_obj.drawString(age_months_units_coord[0], age_months_units_coord[1] - 4, '0')
            
            # Fill pin code digits
            pin_code = field_mapping.get('pin_code', '')
            if pin_code and re.match(r'\d{6}', pin_code):
                pin_coordinates = ['pin_1', 'pin_2', 'pin_3', 'pin_4', 'pin_5', 'pin_6']
                for i, digit in enumerate(pin_code[:6]):
                    coord_key = pin_coordinates[i]
                    coord = self.field_coordinates.get(coord_key)
                    if coord:
                        canvas_obj.drawString(coord[0], coord[1] - 4, digit)
            
        except Exception as e:
            logging.error(f"Error filling special fields: {e}")
    
    def _truncate_text(self, text: str, field_name: str) -> str:
        """Truncate text based on field constraints"""
        field_limits = {
            'applicant_name': 40,
            'surname': 25,
            'given_name': 30,
            'relation_name': 35,
            'street_locality': 50,
            'town_village': 30,
            'post_office': 25,
            'district': 25,
            'state': 20,
            'house_number': 15
        }
        
        limit = field_limits.get(field_name, 50)
        return text[:limit] if len(text) > limit else text
    
    def _fill_pdf_basic_method(
        self, 
        field_mapping: Dict[str, str], 
        output_path: str
    ) -> Optional[str]:
        """Fallback method when ReportLab is not available"""
        try:
            import shutil
            shutil.copy2(self.template_path, output_path)
            
            # Create companion text file with mapped data
            text_output = output_path.replace('.pdf', '_data.txt')
            with open(text_output, 'w', encoding='utf-8') as f:
                f.write("ENHANCED FORM6 DATA MAPPING:\n")
                f.write("=" * 50 + "\n\n")
                for key, value in field_mapping.items():
                    f.write(f"{key.upper().replace('_', ' ')}: {value}\n")
                f.write(f"\nGenerated: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}\n")
            
            logging.info(f"Basic method completed: {output_path}")
            logging.info(f"Data mapping saved to: {text_output}")
            return output_path
            
        except Exception as e:
            logging.error(f"Error in basic fill method: {e}")
            return None


class EnhancedOCRProcessor:
    """Enhanced OCR data processing with improved cleaning algorithms"""
    
    def __init__(self):
        # Enhanced OCR noise patterns
        self.noise_patterns = [
            r'\bEARCERRGAN\b',
            r'\bGovemmentof\b',
            r'\bIndla\b',
            r'\bgfaant\b',
            r'\bFaoet\b',
            r'\bGovernment\s+of\s+India\b',
            r'\bUnique\s+Identification\b',
            r'\bAuthority\s+of\s+India\b',
            r'\b[A-Z]{10,}\b',  # Long all-caps noise
        ]
        
        # Common OCR corrections
        self.corrections = {
            'indla': 'india',
            'govemment': 'government',
            'authonty': 'authority',
            'identihcation': 'identification',
        }
    
    def process_ocr_data(self, raw_data: Dict[str, Any]) -> Dict[str, Any]:
        """Process raw OCR data with enhanced cleaning"""
        processed = {}
        
        # Extract and clean Aadhaar data
        aadhaar_data = raw_data.get('aadhaar_data', {})
        if aadhaar_data:
            processed.update(self._process_aadhaar_data(aadhaar_data))
        
        # Extract and clean Aadhaar BACK data (address lives here typically)
        aadhaar_back_data = raw_data.get('aadhaar_back_data', {})
        if aadhaar_back_data:
            # Reuse voter-data pipeline to parse address components
            processed.update(self._process_voter_data(aadhaar_back_data))

        # Extract and clean voter data
        voter_data = raw_data.get('voter_data', {})
        if voter_data:
            processed.update(self._process_voter_data(voter_data))
        
        return processed
    
    def _process_aadhaar_data(self, aadhaar_data: Dict[str, str]) -> Dict[str, Any]:
        """Process Aadhaar card data with enhanced name extraction"""
        result = {}
        
        # Clean and extract name
        raw_name = aadhaar_data.get('name', '')
        if raw_name:
            result['full_name'] = self._extract_clean_name(raw_name)
            result['surname'] = self._extract_surname(result['full_name'])
            result['given_name'] = self._extract_given_name(result['full_name'])
        
        # Process DOB
        raw_dob = aadhaar_data.get('dob', '')
        if raw_dob:
            result['date_of_birth'] = self._standardize_date(raw_dob)
            result['age'] = self._calculate_age(result['date_of_birth'])
        
        # Clean Aadhaar number
        raw_aadhaar = aadhaar_data.get('aadhaar_number', '')
        if raw_aadhaar:
            result['aadhaar_number'] = self._clean_aadhaar_number(raw_aadhaar)
        
        # Extract gender
        result['gender'] = aadhaar_data.get('gender', 'To be specified')
        
        return result
    
    def _process_voter_data(self, voter_data: Dict[str, str]) -> Dict[str, Any]:
        """Process voter ID data with enhanced address parsing"""
        result = {}
        
        # Extract voter ID number
        raw_voter_id = voter_data.get('voter_id', '')
        if raw_voter_id:
            result['voter_id_number'] = self._clean_voter_id(raw_voter_id)
        
        # Parse address components
        raw_address = voter_data.get('address', '')
        if raw_address:
            address_components = self._parse_address_enhanced(raw_address)
            result.update(address_components)
        
        return result
    
    def _extract_clean_name(self, raw_name: str) -> str:
        """Extract clean person name from noisy OCR text"""
        if not raw_name:
            return ''
        
        # Remove noise patterns
        clean_text = raw_name
        for pattern in self.noise_patterns:
            clean_text = re.sub(pattern, '', clean_text, flags=re.IGNORECASE)
        
        # Apply corrections
        for error, correction in self.corrections.items():
            clean_text = clean_text.replace(error, correction)
        
        # Extract likely person names
        words = re.findall(r'\b[A-Z][a-z]{2,}\b', clean_text)
        
        # Filter out organizational terms
        exclude_terms = {
            'government', 'india', 'authority', 'unique', 'identification',
            'commission', 'election', 'republic', 'union', 'ministry'
        }
        
        filtered_words = [w for w in words if w.lower() not in exclude_terms]
        
        # Return the last 2-3 words as they're most likely the actual name
        if len(filtered_words) >= 2:
            return ' '.join(filtered_words[-2:])
        elif filtered_words:
            return filtered_words[-1]
        
        return 'Name to be provided'
    
    def _extract_surname(self, full_name: str) -> str:
        """Extract surname from full name"""
        if not full_name or full_name == 'Name to be provided':
            return ''
        
        parts = full_name.strip().split()
        return parts[-1] if parts else ''
    
    def _extract_given_name(self, full_name: str) -> str:
        """Extract given name from full name"""
        if not full_name or full_name == 'Name to be provided':
            return ''
        
        parts = full_name.strip().split()
        return ' '.join(parts[:-1]) if len(parts) > 1 else parts[0]
    
    def _standardize_date(self, raw_date: str) -> str:
        """Standardize date format to DD/MM/YYYY"""
        if not raw_date:
            return ''
        
        # Remove extra characters
        clean_date = re.sub(r'[^\d/\-]', '', raw_date)
        
        # Try different patterns
        patterns = [
            r'(\d{1,2})[/\-](\d{1,2})[/\-](\d{4})',  # DD/MM/YYYY
            r'(\d{4})[/\-](\d{1,2})[/\-](\d{1,2})',  # YYYY/MM/DD
        ]
        
        for pattern in patterns:
            match = re.search(pattern, clean_date)
            if match:
                if len(match.group(1)) == 4:  # YYYY/MM/DD format
                    year, month, day = match.groups()
                    return f"{day.zfill(2)}/{month.zfill(2)}/{year}"
                else:  # DD/MM/YYYY format
                    day, month, year = match.groups()
                    return f"{day.zfill(2)}/{month.zfill(2)}/{year}"
        
        return raw_date
    
    def _calculate_age(self, date_of_birth: str) -> str:
        """Calculate age from date of birth"""
        if not date_of_birth or not re.match(r'\d{2}/\d{2}/\d{4}', date_of_birth):
            return ''
        
        try:
            dd, mm, yyyy = date_of_birth.split('/')
            birth_date = date(int(yyyy), int(mm), int(dd))
            today = date.today()
            
            age = today.year - birth_date.year
            if today.month < birth_date.month or (today.month == birth_date.month and today.day < birth_date.day):
                age -= 1
            
            return str(age)
        except (ValueError, TypeError):
            return ''
    
    def _clean_aadhaar_number(self, raw_aadhaar: str) -> str:
        """Clean and format Aadhaar number"""
        if not raw_aadhaar:
            return ''
        
        # Remove all non-digits
        digits = re.sub(r'\D', '', raw_aadhaar)
        
        # Check if it's 12 digits
        if len(digits) == 12:
            return f"{digits[:4]} {digits[4:8]} {digits[8:12]}"
        
        return digits if digits else ''
    
    def _clean_voter_id(self, raw_voter_id: str) -> str:
        """Clean voter ID number"""
        if not raw_voter_id:
            return ''
        
        # Remove extra whitespace and normalize
        clean_id = raw_voter_id.strip().upper()
        
        # Validate pattern (typically 3 letters + 7 digits)
        if re.match(r'^[A-Z]{2,4}\d{6,8}$', clean_id):
            return clean_id
        
        return raw_voter_id  # Return as-is if doesn't match expected pattern
    
    def _parse_address_enhanced(self, raw_address: str) -> Dict[str, str]:
        """Enhanced address parsing with better component extraction"""
        if not raw_address:
            return {}
        
        result = {}
        address = raw_address.strip()
        
        # Extract pin code
        pin_match = re.search(r'\b(\d{6})\b', address)
        if pin_match:
            result['pin_code'] = pin_match.group(1)
            address = address.replace(pin_match.group(0), '').strip()
        
        # Extract house number (at the beginning)
        house_match = re.search(r'^([A-Za-z0-9\-/\s]+?)(?=,|\s+[A-Z])', address)
        if house_match:
            potential_house = house_match.group(1).strip()
            if len(potential_house) <= 20:  # Reasonable house number length
                result['house_number'] = potential_house
                address = address[len(potential_house):].strip()
                if address.startswith(','):
                    address = address[1:].strip()
        
        # Split remaining address by commas
        parts = [p.strip() for p in address.split(',') if p.strip()]
        
        if len(parts) >= 1:
            result['street_locality'] = parts[0]
        if len(parts) >= 2:
            result['town_village'] = parts[1]
        if len(parts) >= 3:
            result['district'] = parts[2]
        if len(parts) >= 4:
            result['state'] = parts[3]
        
        # Set post office same as town/village by default
        result['post_office'] = result.get('town_village', '')
        
        return result


class FormDataValidator:
    """Enhanced form data validation"""
    
    def __init__(self):
        self.validation_rules = {
            'aadhaar_number': r'^\d{4}\s\d{4}\s\d{4}$',
            'date_of_birth': r'^\d{2}/\d{2}/\d{4}$',
            'pin_code': r'^\d{6}$',
            'voter_id_number': r'^[A-Z]{2,4}\d{6,8}$',
        }
    
    def validate_form_data(self, data: Dict[str, Any]) -> 'ValidationResult':
        """Validate form data against rules"""
        errors = []
        warnings = []
        
        # Validate required fields
        required_fields = ['full_name', 'date_of_birth']
        for field in required_fields:
            if not data.get(field):
                errors.append(f"Required field missing: {field}")
        
        # Validate format patterns
        for field, pattern in self.validation_rules.items():
            value = data.get(field)
            if value and not re.match(pattern, value):
                warnings.append(f"Field '{field}' format may be incorrect: {value}")
        
        # Validate age consistency
        if data.get('age') and data.get('date_of_birth'):
            calculated_age = self._calculate_age_from_dob(data['date_of_birth'])
            if calculated_age and abs(int(data['age']) - calculated_age) > 1:
                warnings.append(f"Age inconsistency: provided {data['age']}, calculated {calculated_age}")
        
        return ValidationResult(
            is_valid=len(errors) == 0,
            errors=errors,
            warnings=warnings
        )
    
    def _calculate_age_from_dob(self, dob: str) -> Optional[int]:
        """Calculate age from date of birth string"""
        try:
            if re.match(r'\d{2}/\d{2}/\d{4}', dob):
                dd, mm, yyyy = dob.split('/')
                birth_date = date(int(yyyy), int(mm), int(dd))
                today = date.today()
                
                age = today.year - birth_date.year
                if today.month < birth_date.month or (today.month == birth_date.month and today.day < birth_date.day):
                    age -= 1
                
                return age
        except (ValueError, TypeError):
            pass
        
        return None


class ValidationResult:
    """Validation result container"""
    
    def __init__(self, is_valid: bool, errors: List[str], warnings: List[str]):
        self.is_valid = is_valid
        self.errors = errors
        self.warnings = warnings


class FieldMappingEngine:
    """Enhanced field mapping engine"""
    
    def create_field_mapping(self, processed_data: Dict[str, Any]) -> Dict[str, str]:
        """Create comprehensive field mapping for FORM6 - ENHANCED to use ALL extracted data"""
        mapping = {}
        
        # Basic information - ALL fields mapped with REAL data
        mapping['applicant_name'] = processed_data.get('full_name', '')
        mapping['surname'] = processed_data.get('surname', '')
        mapping['given_name'] = processed_data.get('given_name', '')
        mapping['aadhaar_digits'] = processed_data.get('aadhaar_number', '')
        
        # Mobile number - ADDED
        mapping['mobile_number'] = processed_data.get('mobile_number', '')
        
        # Date and age
        mapping['date_of_birth'] = processed_data.get('date_of_birth', '')
        mapping['age'] = processed_data.get('age', '')
        
        # Gender and relation - Fixed field names to match coordinates
        gender = processed_data.get('gender', '').lower()
        if 'female' in gender:
            mapping['gender_female'] = '✓'
        elif 'male' in gender and 'female' not in gender:
            mapping['gender_male'] = '✓'
        else:
            mapping['gender_third'] = '✓'
        
        # Use REAL relation data, not placeholder
        mapping['father_checkbox'] = '✓' if 'father' in processed_data.get('relation_name', '').lower() else ''
        mapping['mother_checkbox'] = '✓' if 'mother' in processed_data.get('relation_name', '').lower() else ''
        mapping['husband_checkbox'] = '✓' if 'husband' in processed_data.get('relation_name', '').lower() else ''
        mapping['wife_checkbox'] = '✓' if 'wife' in processed_data.get('relation_name', '').lower() else ''
        mapping['relation_name'] = processed_data.get('relation_name', '')
        
        # Address components - ALL fields mapped with REAL data
        mapping['house_number'] = processed_data.get('house_number', '')
        mapping['street_locality'] = processed_data.get('street_locality', '')
        mapping['town_village'] = processed_data.get('town_village', '')
        mapping['post_office'] = processed_data.get('post_office', '')
        mapping['district'] = processed_data.get('district', '')
        mapping['state'] = processed_data.get('state', '')
        mapping['pin_code'] = processed_data.get('pin_code', '')
        
        # Permanent address (copy current address)
        mapping['perm_house_no'] = mapping['house_number']
        mapping['perm_street'] = mapping['street_locality']
        mapping['perm_town'] = mapping['town_village']
        
        # Additional fields - ALL extracted data used
        mapping['voter_id_number'] = processed_data.get('voter_id_number', '')
        mapping['email_address'] = processed_data.get('email_address', '')
        mapping['occupation'] = processed_data.get('occupation', '')
        
        # Log all mappings for debugging
        logging.info(f"Complete field mapping created with {len(mapping)} fields")
        for key, value in mapping.items():
            if value:
                logging.info(f"  {key}: {value}")
        
        return mapping


def test_enhanced_form6():
    """Test the enhanced FORM6 filling system"""
    try:
        filler = EnhancedForm6Filler('FORM6.pdf')
        
        # Test with problematic OCR data
        test_data = {
            'aadhaar_data': {
                'name': 'EARCERRGAN Govemmentof Indla gfaant Faoet Shubhika Sinha',
                'dob': '12/09/2005',
                'aadhaar_number': '969632591947',
                'gender': 'Female'
            },
            'voter_data': {
                'name': 'Shubhika Sinha',
                'address': '123-A, MG Road, Sector 15, New Delhi, Delhi - 110001',
                'voter_id': 'DL1234567'
            }
        }
        
        result = filler.fill_form6_enhanced(test_data, 'enhanced_filled_form6.pdf')
        
        if result:
            print(f"Enhanced FORM6 created successfully: {result}")
            return result
        else:
            print("Failed to create enhanced FORM6")
            return None
            
    except Exception as e:
        print(f"Error in enhanced test: {e}")
        return None


if __name__ == "__main__":
    # Run test
    result = test_enhanced_form6()
    if result:
        logging.info("Enhanced FORM6 system test completed successfully")
    else:
        logging.error("Enhanced FORM6 system test failed")
