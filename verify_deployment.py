#!/usr/bin/env python3
"""
Vercel Deployment Verification Script
Checks that all deployment requirements are met.
"""

import json
import os
import sys
from pathlib import Path

def check_file_exists(filepath, description):
    """Check if a file exists and report status."""
    if Path(filepath).exists():
        print(f"✓ {description}")
        return True
    else:
        print(f"✗ {description}")
        return False

def check_vercel_config():
    """Verify Vercel configuration."""
    print("=== Vercel Deployment Verification ===\n")
    
    success = True
    
    # Check required files
    files_to_check = [
        ("vercel.json", "Vercel configuration file"),
        ("api/index.py", "Serverless API function"),
        ("frontend/package.json", "Frontend package configuration"),
        ("requirements.txt", "Python dependencies"),
        ("README.md", "Documentation"),
        (".env.example", "Environment variable template"),
        (".vercelignore", "Vercel ignore configuration")
    ]
    
    for filepath, description in files_to_check:
        if not check_file_exists(filepath, description):
            success = False
    
    # Check vercel.json structure
    print("\n=== Vercel Configuration ===")
    try:
        with open("vercel.json", "r") as f:
            config = json.load(f)
        
        if "builds" in config and len(config["builds"]) == 2:
            print("✓ Builds configuration correct")
        else:
            print("✗ Builds configuration incorrect")
            success = False
            
        if "routes" in config and len(config["routes"]) == 2:
            print("✓ Routes configuration correct")
        else:
            print("✗ Routes configuration incorrect")
            success = False
            
    except Exception as e:
        print(f"✗ Error reading vercel.json: {e}")
        success = False
    
    # Check API handler
    print("\n=== API Configuration ===")
    try:
        from api.index import app, handler
        print("✓ API handler imports successfully")
        print("✓ FastAPI app configured")
        print("✓ Mangum handler configured")
    except Exception as e:
        print(f"✗ API handler error: {e}")
        success = False
    
    # Check frontend build
    print("\n=== Frontend Configuration ===")
    if Path("frontend/.next").exists():
        print("✓ Frontend build artifacts exist")
    else:
        print("⚠ Frontend not built (run 'npm run build' in frontend/)")
    
    print(f"\n=== Summary ===")
    if success:
        print("✓ Deployment configuration is ready for Vercel!")
        print("\nNext steps:")
        print("1. Set environment variables in Vercel dashboard:")
        print("   - OPENAI_API_KEY (optional)")
        print("   - HF_API_KEY (optional)")
        print("   - NODE_ENV=production")
        print("2. Deploy to Vercel")
        return 0
    else:
        print("✗ Deployment configuration has issues that need to be fixed.")
        return 1

if __name__ == "__main__":
    sys.exit(check_vercel_config())