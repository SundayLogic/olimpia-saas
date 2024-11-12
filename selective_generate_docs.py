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

def write_directory_tree(md_file, path, indent_level=0, files_to_document=None):
    """Recursively write directory tree structure."""
    if should_ignore(path):
        return

    indent = '    ' * indent_level
    dir_name = os.path.basename(path)
    
    if indent_level > 0:  # Don't print the root directory name
        md_file.write(f"{indent}├── {dir_name}/\n")

    # Get and sort directory contents
    try:
        entries = sorted(os.scandir(path), key=lambda e: (not e.is_dir(), e.name))
    except OSError:
        return

    last_was_dir = False
    for entry in entries:
        if should_ignore(entry.path):
            continue

        if entry.is_dir():
            write_directory_tree(md_file, entry.path, indent_level + 1, files_to_document)
            last_was_dir = True
        else:
            if last_was_dir:
                # Add extra indent for files after directories
                md_file.write(f"{indent}│   \n")
            md_file.write(f"{indent}│   ├── {entry.name}\n")
            if files_to_document is not None:
                files_to_document.append(entry.path)
            last_was_dir = False

def generate_documentation(base_directory, target_paths, output_file):
    """Generate project documentation in markdown format for specific directories."""
    base_directory = os.path.abspath(base_directory)
    
    # Normalize target paths to be absolute and relative to base directory
    absolute_target_paths = [os.path.abspath(os.path.join(base_directory, path)) for path in target_paths]
    
    with open(output_file, 'w', encoding='utf-8') as md_file:
        # Write header with timestamp
        md_file.write(f"# Documentation for Selected Directories\n\n")
        md_file.write(f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
        md_file.write("## Documented Directories:\n")
        for path in target_paths:
            md_file.write(f"- {path}\n")
        md_file.write("\n")
        
        # Write directory structure
        md_file.write("## Directory Structure\n\n")
        md_file.write("```\n")
        
        # Track the files we'll need to document
        files_to_document = []
        
        # Process each target path
        for target_path in absolute_target_paths:
            if not os.path.exists(target_path):
                md_file.write(f"Warning: Path not found - {target_path}\n")
                continue
                
            relative_target = os.path.relpath(target_path, base_directory)
            md_file.write(f"{relative_target}/\n")
            
            # Use the new recursive function to write directory tree
            write_directory_tree(md_file, target_path, 1, files_to_document)
            md_file.write("\n")  # Add spacing between different target directories
                    
        md_file.write("```\n\n")
        
        # Write file contents
        md_file.write("## File Contents\n\n")
        for file_path in files_to_document:
            relative_path = os.path.relpath(file_path, base_directory)
            md_file.write(f"### {relative_path}\n\n")
            
            # Get file extension for code block
            extension = get_file_extension(file_path)
            
            # Write file content
            content = get_file_content(file_path)
            md_file.write(f"```{extension}\n")
            md_file.write(content)
            md_file.write("\n```\n\n")

def main():
    parser = argparse.ArgumentParser(description='Generate project documentation for specific directories')
    parser.add_argument('directories', nargs='+', help='List of directories to document')
    parser.add_argument('--dir', default='.', help='Base directory (defaults to current directory)')
    parser.add_argument('--output', default='README.md', help='Output file name (defaults to README.md)')
    
    args = parser.parse_args()
    
    base_directory = os.path.abspath(args.dir)
    target_paths = args.directories
    output_file = args.output
    
    print(f"Base directory: {base_directory}")
    print(f"Generating documentation for paths: {', '.join(target_paths)}")
    print(f"Output file: {output_file}")
    
    generate_documentation(base_directory, target_paths, output_file)
    print("Documentation generated successfully!")

if __name__ == "__main__":
    main()