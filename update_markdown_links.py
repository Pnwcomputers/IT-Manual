#!/usr/bin/env python3
"""
Dynamic Markdown Link Updater
-----------------------------
This script automatically scans the repository to build a file index.
It then checks every markdown file and updates internal links to point
to the correct relative path, regardless of where the file was moved.
"""

import os
import re
from pathlib import Path

# Directories to ignore (hidden files, git, etc.)
IGNORE_DIRS = {'.git', '.vscode', '.idea', '__pycache__', 'venv'}

def build_file_index(root_path):
    """
    Walks the directory tree to create a map of {filename: directory_path}.
    This allows us to find where a file lives dynamically.
    """
    file_index = {}
    duplicates = []

    print("🔍 Scanning repository structure...")
    
    for root, dirs, files in os.walk(root_path):
        # Filter out ignored directories
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]
        
        for file in files:
            if file.endswith('.md'):
                # We skip README.md from the index because there are many of them,
                # and we usually link to directories, not specific README files.
                if file.lower() == 'readme.md':
                    continue
                
                if file in file_index:
                    duplicates.append(file)
                else:
                    # Store the path relative to the repo root
                    rel_dir = os.path.relpath(root, root_path)
                    file_index[file] = rel_dir

    if duplicates:
        print(f"⚠️ Warning: Found duplicate filenames (links might be ambiguous): {duplicates}")
        
    return file_index

def update_file_links(filepath, file_index, repo_root):
    """
    Scans a single file and updates its links based on the file_index.
    """
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except UnicodeDecodeError:
        print(f"❌ Error reading {filepath} (encoding issue)")
        return False

    original_content = content
    
    # Regex explains:
    # \[([^\]]+)\]  -> Capture Link Text [text]
    # \(([^)]+)\)   -> Capture Link Path (path)
    # We look for .md files in the path
    link_pattern = r'\[([^\]]+)\]\(([^)]+\.md)\)'

    def replace_link(match):
        text = match.group(1)
        current_link_path = match.group(2)
        
        # Extract the target filename from the link (ignore current ../ pathing)
        target_filename = os.path.basename(current_link_path)
        
        # 1. Check if the file exists in our index
        if target_filename in file_index:
            target_dir = file_index[target_filename]
            
            # 2. Calculate the "From" directory (where the current file is)
            current_file_dir = os.path.dirname(filepath)
            
            # 3. Calculate the absolute path to the target
            target_abs_path = os.path.join(repo_root, target_dir, target_filename)
            
            # 4. Calculate the new relative path
            new_rel_path = os.path.relpath(target_abs_path, current_file_dir)
            
            # Convert Windows backslashes to Forward slashes for Markdown standard
            new_rel_path = new_rel_path.replace(os.sep, '/')
            
            return f'[{text}]({new_rel_path})'
        
        # If file not in index (or is a README), return original link
        return match.group(0)

    new_content = re.sub(link_pattern, replace_link, content)

    if new_content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True
    
    return False

def main():
    repo_root = os.getcwd()
    file_index = build_file_index(repo_root)
    
    print(f"✅ Indexed {len(file_index)} unique markdown files.")
    print("-" * 50)
    
    updated_count = 0
    
    # Walk through all files again to update them
    for root, dirs, files in os.walk(repo_root):
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]
        
        for file in files:
            if file.endswith('.md'):
                filepath = os.path.join(root, file)
                if update_file_links(filepath, file_index, repo_root):
                    rel_path = os.path.relpath(filepath, repo_root)
                    print(f"✏️  Fixed links in: {rel_path}")
                    updated_count += 1

    print("-" * 50)
    if updated_count == 0:
        print("🎉 All links appear correct. No changes made.")
    else:
        print(f"🚀 updated {updated_count} files with correct paths.")

if __name__ == "__main__":
    main()
