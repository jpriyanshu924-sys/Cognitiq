import os
import json

logs_dir = r"C:\Users\PRIYANSHU\.gemini\antigravity\brain\1824d4c4-76a6-440b-9391-2496aebf5b27\.system_generated\logs"
transcript_path = os.path.join(logs_dir, "transcript.jsonl")

if os.path.exists(transcript_path):
    print("Transcript found. Scanning...")
    original_index = None
    original_style = None
    
    with open(transcript_path, "r", encoding="utf-8") as f:
        for line in f:
            try:
                step = json.loads(line)
                # We are looking for view_file tool calls or responses that contain index.html or style.css
                tool_calls = step.get("tool_calls", [])
                for call in tool_calls:
                    func = call.get("function", {})
                    name = func.get("name")
                    args = func.get("arguments", {})
                    path = args.get("AbsolutePath", "")
                    
                    # Or check step outputs
                    if name == "view_file":
                        if "index.html" in path:
                            # If it read index.html before we updated it
                            pass
            except Exception as e:
                pass
    print("Done scanning.")
else:
    print("Transcript not found at", transcript_path)
