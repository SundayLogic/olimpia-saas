import os
import pathlib
import argparse
from datetime import datetime

def should_ignore(path):
    """Check if the path should be ignored."""
    ignore_patterns = ['.next', 'node_modules', '__pycache__', '.git']
    return any(pattern in str(path) for pattern in ignore_patterns)

def get_file_content(file_path):
    """Read and return the content of a file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()
    except Exception as e:
        return f"Error reading file: {str(e)}"

def get_file_extension(file_path):
    """Get the file extension for markdown code block."""
    ext = pathlib.Path(file_path).suffix.lower()[1:]
    # Map TypeScript extensions
    if ext in ['tsx', 'ts']:
        return 'typescript'
    elif ext == 'jsx':
        return 'javascript'
    return ext

def generate_documentation(directory_path, output_file):
    """Generate project documentation in markdown format."""
    directory_path = os.path.abspath(directory_path)
    current_folder_name = os.path.basename(directory_path)
    
    with open(output_file, 'w', encoding='utf-8') as md_file:
        # Write header with timestamp
        md_file.write(f"# Documentation for: {current_folder_name}\n\n")
        md_file.write(f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
        
        # Write directory structure
        md_file.write("## Directory Structure\n\n")
        md_file.write("```\n")
        md_file.write(f"{current_folder_name}/\n")
        
        # Track the files we'll need to document
        files_to_document = []
        
        # Generate tree structure
        for root, dirs, files in os.walk(directory_path):
            # Skip ignored directories
            dirs[:] = [d for d in dirs if not should_ignore(os.path.join(root, d))]
            if should_ignore(root):
                continue
            
            # Calculate relative level for indentation
            level = os.path.relpath(root, directory_path).count(os.sep)
            indent = '    ' * level
            
            # Add directories
            if level > 0:
                folder_name = os.path.basename(root)
                md_file.write(f"{indent}├── {folder_name}/\n")
            
            # Add files
            for file in sorted(files):
                if not should_ignore(os.path.join(root, file)):
                    md_file.write(f"{indent}│   ├── {file}\n")
                    files_to_document.append(os.path.join(root, file))
                    
        md_file.write("```\n\n")
        
        # Write file contents
        md_file.write("## File Contents\n\n")
        for file_path in files_to_document:
            relative_path = os.path.relpath(file_path, directory_path)
            md_file.write(f"### {relative_path}\n\n")
            
            # Get file extension for code block
            extension = get_file_extension(file_path)
            
            # Write file content
            content = get_file_content(file_path)
            md_file.write(f"```{extension}\n")
            md_file.write(content)
            md_file.write("\n```\n\n")

def main():
    parser = argparse.ArgumentParser(description='Generate project documentation for current directory')
    parser.add_argument('--dir', default='.', help='Directory to document (defaults to current directory)')
    parser.add_argument('--output', default='README.md', help='Output file name (defaults to README.md)')
    
    args = parser.parse_args()
    
    directory_path = os.path.abspath(args.dir)
    output_file = args.output
    
    print(f"Generating documentation for: {directory_path}")
    print(f"Output file: {output_file}")
    
    generate_documentation(directory_path, output_file)
    print("Documentation generated successfully!")

if __name__ == "__main__":
    main()