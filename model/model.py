import sys
import traceback
import subprocess

try:
    print('Entered python file')
    
    # Auto-install required packages
    print("Checking/installing required packages...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "detoxify", "--quiet"])
        print("Detoxify installed successfully")
    except Exception as e:
        print(f"Warning: Could not install detoxify: {e}")
    
    # Get comment text from arguments
    if len(sys.argv) < 2:
        print("No comment text provided")
        sys.exit(1)
    
    comment_text = sys.argv[1]
    print(f'Analyzing: {comment_text[:50]}...')  # Show first 50 chars
    
    # Try to import detoxify with fallback
    try:
        from detoxify import Detoxify
        
        def evaluate_text(text):
            try:
                # Use Detoxify for toxicity detection
                results = Detoxify('original').predict(text)
                print(f"Detoxify raw scores: {results}")
                
                # Map Detoxify toxicity scores to hate_rating
                hate_score = max(
                    results['toxicity'], 
                    results['severe_toxicity'], 
                    results['obscene'], 
                    results['identity_attack'], 
                    results['insult'],
                    results['threat']
                ) * 100  # Convert from 0-1 to 0-100 scale
                
                # Custom spam detection
                spam_indicators = [
                    'buy', 'free', 'discount', 'money', 'click', 'offer', 'limited', 
                    'earn', 'cash', 'winner', 'prize', 'congratulations', 'selected', 
                    'credit', 'guarantee', 'investment', 'rates', 'refinance'
                ]
                
                lower_text = text.lower()
                words = lower_text.split()
                spam_word_count = sum(1 for word in words if word in spam_indicators)
                
                spam_score = 0
                if len(words) > 0:
                    spam_score = min(100, (spam_word_count / len(words)) * 300)
                
                # Return in the format expected by app.js
                return hate_score, spam_score
            except Exception as e:
                print(f"Error in Detoxify evaluation: {e}")
                traceback.print_exc()
                # Fall back to basic filtering
                return fallback_evaluate_text(text)
                
    except ImportError:
        print("Could not import Detoxify, using fallback method")
        
        def evaluate_text(text):
            return fallback_evaluate_text(text)
    
    # Fallback method using basic word filtering
    def fallback_evaluate_text(text):
        hate_words = ['hate', 'kill', 'die', 'murder', 'suicide', 'pain', 'racist']
        spam_words = ['buy', 'free', 'discount', 'money', 'click', 'offer', 'limited']
        
        text = text.lower()
        words = text.split()
        
        hate_count = sum(1 for word in words if word in hate_words)
        spam_count = sum(1 for word in words if word in spam_words)
        
        hate_rating = min(100, hate_count * 15)
        spam_rating = min(100, spam_count * 15)
        
        return hate_rating, spam_rating
    
    # Evaluate the text
    hate_rating, spam_rating = evaluate_text(comment_text)
    
    # Output in the EXACT format expected by app.js regex
    print(f"({hate_rating}, {spam_rating})")
    
except Exception as e:
    print(f"Error: {e}")
    traceback.print_exc()
    sys.exit(1)