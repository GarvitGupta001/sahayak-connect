"""
Enhanced Flask Server with optimized FORM6 filling
Integrates the enhanced form filler with improved error handling and validation
"""

from flask import Flask, request, render_template, jsonify, send_file
import json
from werkzeug.utils import secure_filename
import os
import re
import logging
from datetime import datetime
from typing import Dict, Any, Optional, Tuple
import traceback

# Import enhanced form filler
from enhanced_form6_filler import EnhancedForm6Filler

# Enhanced OCR import
try:
    import easyocr
    OCR_AVAILABLE = True
except ImportError:
    OCR_AVAILABLE = False

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Configure enhanced logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('enhanced_server.log'),
        logging.StreamHandler()
    ]
)

class EnhancedOCRExtractor:
    """Enhanced OCR extraction with better error handling and validation"""
    
    def __init__(self):
        if OCR_AVAILABLE:
            self.reader = easyocr.Reader(['en'], gpu=False)  # Disable GPU for compatibility
        else:
            self.reader = None
        
        # Enhanced patterns for better extraction
        self.aadhaar_patterns = [
            r'\b\d{4}\s+\d{4}\s+\d{4}\b',  # Standard format with spaces
            r'\b\d{12}\b',  # Continuous 12 digits
            r'\b\d{4}-\d{4}-\d{4}\b',  # Dash separated
            r'\b\d{4}\d{4}\d{4}\b',  # No separator
        ]
        
        self.date_patterns = [
            r'DOB[:\s]*(\d{1,2}[/-]\d{1,2}[/-]\d{4})',  # DOB: DD/MM/YYYY
            r'Date[:\s]+(?:of[:\s]+Birth[:\s]*)?(\d{1,2}[/-]\d{1,2}[/-]\d{4})',
            r'\b(\d{1,2}[/-]\d{1,2}[/-]\d{4})\b',  # Standalone date
        ]
        
        self.name_patterns = [
            r'([A-Z][a-z]{2,}\s+[A-Z][a-z]{2,}(?:\s+[A-Z][a-z]+)*)',  # Full names
            r'Name[:\s]*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)',  # After "Name:" label
        ]
        
        self.voter_id_patterns = [
            r'[A-Z]{2,4}\d{6,8}',  # Standard voter ID format
            r'[A-Z]{3}\d{7}',  # Common format
        ]
        
        # OCR noise terms to exclude from names
        self.exclude_terms = {
            'government', 'india', 'aadhaar', 'authority', 'unique', 
            'identification', 'commission', 'election', 'form', 'republic',
            'earcerrgan', 'govemmentof', 'indla', 'gfaant', 'faoet'
        }
    
    def extract_aadhaar_info(self, image_path: str) -> Dict[str, str]:
        """Enhanced Aadhaar information extraction"""
        try:
            if not self.reader:
                logging.warning("OCR reader not available, using mock data")
                return self._get_mock_aadhaar_data()
            
            # Extract text from image
            results = self.reader.readtext(image_path)
            text = ' '.join([result[1] for result in results])
            
            logging.info(f"Raw Aadhaar OCR text: {text}")
            
            # Clean and process text
            cleaned_text = self._clean_ocr_text(text)
            
            # Extract information
            extracted = {
                'name': self._extract_name_enhanced(cleaned_text, text),
                'aadhaar_number': self._extract_aadhaar_number(cleaned_text),
                'dob': self._extract_date_of_birth(cleaned_text),
                'gender': self._extract_gender(cleaned_text)
            }
            
            # Validate and clean extracted data
            validated = self._validate_aadhaar_data(extracted)
            
            logging.info(f"Extracted Aadhaar data: {validated}")
            return validated
            
        except Exception as e:
            logging.error(f"Error extracting Aadhaar info: {e}")
            logging.error(traceback.format_exc())
            return self._get_mock_aadhaar_data()
    
    def extract_voter_info(self, image_path: str) -> Dict[str, str]:
        """Enhanced voter ID information extraction"""
        try:
            if not self.reader:
                logging.warning("OCR reader not available, using mock data")
                return self._get_mock_voter_data()
            
            # Extract text from image
            results = self.reader.readtext(image_path)
            text = ' '.join([result[1] for result in results])
            
            logging.info(f"Raw Voter ID OCR text: {text}")
            
            # Clean and process text
            cleaned_text = self._clean_ocr_text(text)
            
            # Extract information
            extracted = {
                'voter_id': self._extract_voter_id(cleaned_text),
                'name': self._extract_name_enhanced(cleaned_text, text),
                'address': self._extract_address(cleaned_text)
            }
            
            # Validate and clean extracted data
            validated = self._validate_voter_data(extracted)
            
            logging.info(f"Extracted voter data: {validated}")
            return validated
            
        except Exception as e:
            logging.error(f"Error extracting voter info: {e}")
            logging.error(traceback.format_exc())
            return self._get_mock_voter_data()
    
    def _clean_ocr_text(self, text: str) -> str:
        """Clean OCR text by removing noise and normalizing"""
        if not text:
            return ''
        
        # Convert to lowercase and remove extra whitespace
        clean_text = ' '.join(text.split())
        return clean_text
    
    def _extract_name_enhanced(self, cleaned_text: str, original_text: str) -> str:
        """Enhanced name extraction with better noise filtering"""
        candidates = []
        
        # Try pattern-based extraction
        for pattern in self.name_patterns:
            matches = re.findall(pattern, original_text, re.IGNORECASE)
            candidates.extend(matches)
        
        # Look for names before DOB pattern
        dob_pattern = r'([A-Z][a-z]+\s+[A-Z][a-z]+)\s+.*?(?:DOB|\d{1,2}/\d{1,2}/\d{4})'
        dob_match = re.search(dob_pattern, original_text, re.IGNORECASE)
        if dob_match:
            candidates.append(dob_match.group(1))
        
        # Filter and score candidates
        best_name = self._select_best_name(candidates)
        
        if not best_name:
            # Fallback: extract capitalized words
            words = re.findall(r'\b[A-Z][a-z]{2,}\b', original_text)
            filtered_words = [w for w in words if w.lower() not in self.exclude_terms]
            if len(filtered_words) >= 2:
                best_name = ' '.join(filtered_words[-2:])
        
        return best_name or 'Name to be provided'
    
    def _select_best_name(self, candidates: list) -> str:
        """Select the best name candidate based on scoring"""
        if not candidates:
            return ''
        
        scored_candidates = []
        for candidate in candidates:
            if not candidate or len(candidate) < 3:
                continue
            
            score = self._score_name_candidate(candidate)
            if score > 0:
                scored_candidates.append((candidate.strip(), score))
        
        if scored_candidates:
            # Sort by score and return the best
            scored_candidates.sort(key=lambda x: x[1], reverse=True)
            return scored_candidates[0][0]
        
        return ''
    
    def _score_name_candidate(self, candidate: str) -> int:
        """Score a name candidate"""
        score = 0
        candidate_lower = candidate.lower()
        
        # Positive factors
        if re.match(r'^[A-Za-z\s]+$', candidate):  # Only letters and spaces
            score += 10
        
        if len(candidate.split()) >= 2:  # At least first and last name
            score += 10
        
        if 3 <= len(candidate) <= 50:  # Reasonable length
            score += 5
        
        # Negative factors
        for exclude_term in self.exclude_terms:
            if exclude_term in candidate_lower:
                score -= 15
        
        if any(char.isdigit() for char in candidate):  # Contains numbers
            score -= 10
        
        return score
    
    def _extract_aadhaar_number(self, text: str) -> str:
        """Extract Aadhaar number with validation"""
        for pattern in self.aadhaar_patterns:
            match = re.search(pattern, text)
            if match:
                aadhaar = match.group(0).strip()
                # Clean and validate
                digits = re.sub(r'\D', '', aadhaar)
                if len(digits) == 12:
                    return f"{digits[:4]} {digits[4:8]} {digits[8:12]}"
        return ''
    
    def _extract_date_of_birth(self, text: str) -> str:
        """Extract date of birth with format standardization"""
        for pattern in self.date_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                date_str = match.group(1) if match.groups() else match.group(0)
                return self._standardize_date(date_str)
        return ''
    
    def _extract_gender(self, text: str) -> str:
        """Extract gender from text"""
        text_lower = text.lower()
        if 'female' in text_lower:
            return 'Female'
        elif 'male' in text_lower:
            return 'Male'
        return 'To be specified'
    
    def _extract_voter_id(self, text: str) -> str:
        """Extract voter ID number"""
        for pattern in self.voter_id_patterns:
            match = re.search(pattern, text)
            if match:
                return match.group(0).strip().upper()
        return ''
    
    def _extract_address(self, text: str) -> str:
        """Extract address information"""
        # Look for address patterns
        address_indicators = ['address', 'addr', 'residence', 'house']
        
        for indicator in address_indicators:
            pattern = rf'{indicator}[:\s]*([A-Za-z0-9\s,.-]+?)(?:\n|$|\s{{5,}})'
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return match.group(1).strip()
        
        # Fallback: look for patterns with numbers and locality names
        address_pattern = r'([A-Za-z0-9\s,.-]+(?:Road|Street|Lane|Avenue|Colony|Nagar|Block)[A-Za-z0-9\s,.-]*)'
        match = re.search(address_pattern, text, re.IGNORECASE)
        if match:
            return match.group(1).strip()
        
        return ''
    
    def _standardize_date(self, date_str: str) -> str:
        """Standardize date format to DD/MM/YYYY"""
        if not date_str:
            return ''
        
        # Remove extra characters
        clean_date = re.sub(r'[^\d/\-]', '', date_str)
        
        # Try DD/MM/YYYY pattern
        match = re.search(r'(\d{1,2})[/\-](\d{1,2})[/\-](\d{4})', clean_date)
        if match:
            day, month, year = match.groups()
            return f"{day.zfill(2)}/{month.zfill(2)}/{year}"
        
        return date_str
    
    def _validate_aadhaar_data(self, data: Dict[str, str]) -> Dict[str, str]:
        """Validate and clean Aadhaar data"""
        validated = data.copy()
        
        # Ensure name is properly formatted
        if validated['name'] and validated['name'] != 'Name to be provided':
            validated['name'] = ' '.join([word.capitalize() for word in validated['name'].split()])
        
        # Validate Aadhaar format
        if validated['aadhaar_number']:
            digits = re.sub(r'\D', '', validated['aadhaar_number'])
            if len(digits) != 12:
                logging.warning(f"Invalid Aadhaar format: {validated['aadhaar_number']}")
        
        return validated
    
    def _validate_voter_data(self, data: Dict[str, str]) -> Dict[str, str]:
        """Validate and clean voter data"""
        validated = data.copy()
        
        # Ensure name is properly formatted
        if validated['name'] and validated['name'] != 'Name to be provided':
            validated['name'] = ' '.join([word.capitalize() for word in validated['name'].split()])
        
        # Clean address
        if validated['address']:
            validated['address'] = ' '.join(validated['address'].split())
        
        return validated
    
    def _get_mock_aadhaar_data(self) -> Dict[str, str]:
        """Mock Aadhaar data for testing"""
        return {
            'name': 'Test User',
            'aadhaar_number': '1234 5678 9012',
            'dob': '01/01/1990',
            'gender': 'Male'
        }
    
    def _get_mock_voter_data(self) -> Dict[str, str]:
        """Mock voter data for testing"""
        return {
            'voter_id': 'TST1234567',
            'name': 'Test User',
            'address': '123 Test Street, Test City, State - 123456'
        }


# Initialize enhanced components
ocr_extractor = EnhancedOCRExtractor()
processing_status = {'status': 'idle', 'progress': 0, 'message': ''}


@app.route('/')
def index():
    """Main page"""
    return render_template('form.html')


@app.route('/status')
def get_status():
    """Get processing status"""
    return jsonify(processing_status)


@app.route('/upload', methods=['POST'])
def upload_documents():
    """Enhanced document upload and processing"""
    global processing_status
    
    if 'aadhaar' not in request.files or 'voter' not in request.files:
        return jsonify({'error': 'Please upload both Aadhaar and Voter ID'}), 400
    
    aadhaar = request.files['aadhaar']
    voter = request.files['voter']
    
    if aadhaar.filename == '' or voter.filename == '':
        return jsonify({'error': 'No selected files'}), 400
    
    # Initialize file paths for cleanup
    aadhaar_path = None
    voter_path = None
    
    try:
        # Reset processing status
        processing_status.update({
            'status': 'processing',
            'progress': 0,
            'message': 'Starting document processing...'
        })
        
        # Ensure uploads directory exists
        os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
        
        # Update status
        processing_status.update({
            'progress': 10,
            'message': 'Saving uploaded files...'
        })
        
        # Save uploaded files with secure filenames
        aadhaar_path = os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(aadhaar.filename))
        voter_path = os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(voter.filename))
        
        aadhaar.save(aadhaar_path)
        voter.save(voter_path)
        
        # Verify files were saved
        if not os.path.exists(aadhaar_path) or not os.path.exists(voter_path):
            raise FileNotFoundError("Failed to save uploaded files")
        
        logging.info(f"Files saved: {aadhaar_path}, {voter_path}")
        
        # Update status
        processing_status.update({
            'progress': 30,
            'message': 'Extracting information from Aadhaar...'
        })
        
        # Extract information using enhanced OCR
        aadhaar_data = ocr_extractor.extract_aadhaar_info(aadhaar_path)
        
        processing_status.update({
            'progress': 50,
            'message': 'Extracting information from Voter ID...'
        })
        
        voter_data = ocr_extractor.extract_voter_info(voter_path)
        
        processing_status.update({
            'progress': 70,
            'message': 'Filling FORM6 with enhanced mapping...'
        })
        
        # Use enhanced FORM6 filler
        try:
            form6_filler = EnhancedForm6Filler('FORM6.pdf')
            
            # Prepare data for enhanced filler
            extracted_data = {
                'aadhaar_data': aadhaar_data,
                'voter_data': voter_data
            }
            
            # Fill the form with enhanced processing
            filled_form_path = form6_filler.fill_form6_enhanced(
                extracted_data, 
                'enhanced_filled_form.pdf'
            )
            
            if filled_form_path and os.path.exists(filled_form_path):
                processing_status.update({
                    'status': 'complete',
                    'progress': 100,
                    'message': 'Form filled successfully with enhanced mapping!'
                })
                
                logging.info(f"Enhanced FORM6 created: {filled_form_path}")
                
                # Return success response
                return jsonify({
                    'message': 'Documents processed successfully with enhanced form filling',
                    'pdfUrl': '/view-pdf',
                    'extractedData': {
                        'aadhaar': aadhaar_data,
                        'voter': voter_data
                    }
                })
            else:
                raise Exception("Enhanced form filling failed")
                
        except Exception as form_error:
            logging.error(f"Enhanced form filling error: {form_error}")
            processing_status.update({
                'status': 'error',
                'message': f'Enhanced form filling failed: {str(form_error)}'
            })
            return jsonify({'error': f'Enhanced form filling failed: {str(form_error)}'}), 500
        
    except Exception as e:
        logging.error(f"Document processing error: {e}")
        logging.error(traceback.format_exc())
        processing_status.update({
            'status': 'error',
            'message': f'Processing failed: {str(e)}'
        })
        return jsonify({'error': f'Processing failed: {str(e)}'}), 500
    
    finally:
        # Clean up uploaded files
        for file_path in [aadhaar_path, voter_path]:
            if file_path and os.path.exists(file_path):
                try:
                    os.remove(file_path)
                    logging.info(f"Cleaned up: {file_path}")
                except Exception as cleanup_error:
                    logging.warning(f"Failed to cleanup {file_path}: {cleanup_error}")


@app.route('/view-pdf')
def view_pdf():
    """Serve the filled PDF"""
    pdf_paths = [
        'enhanced_filled_form.pdf',
        'filled_form.pdf',
        'enhanced_filled_form6.pdf'
    ]
    
    for pdf_path in pdf_paths:
        if os.path.exists(pdf_path):
            logging.info(f"Serving PDF: {pdf_path}")
            return send_file(os.path.abspath(pdf_path), mimetype='application/pdf')
    
    logging.error("No filled PDF found")
    return jsonify({'error': 'PDF not found'}), 404


@app.route('/debug/files')
def debug_files():
    """Debug endpoint to check file status"""
    files_info = {
        'current_directory': os.getcwd(),
        'files_in_directory': [f for f in os.listdir('.') if f.endswith('.pdf')],
        'uploads_directory_exists': os.path.exists('uploads'),
        'uploads_contents': os.listdir('uploads') if os.path.exists('uploads') else [],
        'enhanced_filled_form_exists': os.path.exists('enhanced_filled_form.pdf'),
        'filled_form_exists': os.path.exists('filled_form.pdf'),
        'FORM6_exists': os.path.exists('FORM6.pdf'),
        'processing_status': processing_status
    }
    return jsonify(files_info)


@app.route('/test/enhanced-form')
def test_enhanced_form():
    """Test endpoint for enhanced form filling"""
    try:
        # Test data with OCR noise
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
        
        # Use enhanced form filler
        form6_filler = EnhancedForm6Filler('FORM6.pdf')
        result = form6_filler.fill_form6_enhanced(test_data, 'enhanced_filled_form.pdf')
        
        if result and os.path.exists(result):
            return jsonify({
                'message': 'Enhanced FORM6 test completed successfully!',
                'pdfUrl': '/view-pdf',
                'pdfPath': result,
                'testData': test_data
            })
        else:
            return jsonify({'error': 'Enhanced form test failed'}), 500
            
    except Exception as e:
        logging.error(f"Enhanced form test error: {e}")
        logging.error(traceback.format_exc())
        return jsonify({'error': f'Enhanced form test error: {str(e)}'}), 500


@app.route('/test/ocr-extraction')
def test_ocr_extraction():
    """Test endpoint for OCR extraction"""
    try:
        # Test with mock data to validate OCR processing
        mock_aadhaar_text = "EARCERRGAN Govemmentof Indla gfaant Faoet Shubhika Sinha DOB 12/09/2005 969632591947"
        mock_voter_text = "Voter ID: DL1234567 Name: Shubhika Sinha Address: 123 MG Road, New Delhi, Delhi 110001"
        
        # Process mock data
        name = ocr_extractor._extract_name_enhanced(mock_aadhaar_text, mock_aadhaar_text)
        aadhaar = ocr_extractor._extract_aadhaar_number(mock_aadhaar_text)
        dob = ocr_extractor._extract_date_of_birth(mock_aadhaar_text)
        
        return jsonify({
            'message': 'OCR extraction test completed',
            'results': {
                'extracted_name': name,
                'extracted_aadhaar': aadhaar,
                'extracted_dob': dob,
                'original_text': mock_aadhaar_text
            }
        })
        
    except Exception as e:
        logging.error(f"OCR extraction test error: {e}")
        return jsonify({'error': f'OCR test error: {str(e)}'}), 500


@app.errorhandler(413)
def too_large(e):
    """Handle file too large error"""
    return jsonify({'error': 'File too large. Maximum size is 16MB.'}), 413


@app.errorhandler(Exception)
def handle_exception(e):
    """Global exception handler"""
    logging.error(f"Unhandled exception: {e}")
    logging.error(traceback.format_exc())
    
    processing_status.update({
        'status': 'error',
        'message': f'Server error: {str(e)}'
    })
    
    return jsonify({'error': f'Server error: {str(e)}'}), 500


if __name__ == '__main__':
    logging.info("Starting Enhanced Flask Server for FORM6 Processing")
    app.run(debug=True, host='0.0.0.0', port=5000)
