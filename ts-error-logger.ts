import * as fs from 'fs';
import * as path from 'path';
import { execSync, ExecSyncOptionsWithStringEncoding } from 'child_process';

interface TypeScriptError {
    file: string;
    line: number;
    character: number;
    code: string;
    message: string;
}

interface CommandError extends Error {
    stdout?: string;
    stderr?: string;
    status?: number;
}

function getTypeScriptErrors(filePath: string): TypeScriptError[] {
    try {
        const options: ExecSyncOptionsWithStringEncoding = {
            encoding: 'utf-8',
            stdio: 'pipe'
        };
        
        const output = execSync(`tsc --noEmit ${filePath}`, options);
        return parseTypeScriptOutput(output);
    } catch (error) {
        const commandError = error as CommandError;
        return parseTypeScriptOutput(commandError.stdout || '');
    }
}

function parseTypeScriptOutput(output: string): TypeScriptError[] {
    const errors: TypeScriptError[] = [];
    const lines = output.split('\n');

    for (const line of lines) {
        // Match the TypeScript error format: file(line,character): error TS2307: message
        const match = line.match(/(.+)\((\d+),(\d+)\): error (TS\d+): (.+)/);
        if (match) {
            errors.push({
                file: match[1],
                line: parseInt(match[2]),
                character: parseInt(match[3]),
                code: match[4],
                message: match[5].trim()
            });
        }
    }

    return errors;
}

function generateMarkdown(errors: TypeScriptError[], filePath: string): string {
    const fileName = path.basename(filePath);
    const date = new Date().toISOString().split('T')[0];
    
    let markdown = `# TypeScript Errors Report - ${fileName}\n\n`;
    markdown += `Generated on: ${date}\n\n`;

    if (errors.length === 0) {
        markdown += '✅ No TypeScript errors found!\n';
        return markdown;
    }

    markdown += `Found ${errors.length} error${errors.length === 1 ? '' : 's'}:\n\n`;

    errors.forEach((error, index) => {
        markdown += `## Error ${index + 1}\n\n`;
        markdown += `- **Location**: ${error.file}:${error.line}:${error.character}\n`;
        markdown += `- **Error Code**: \`${error.code}\`\n`;
        markdown += `- **Message**: ${error.message}\n\n`;
        markdown += `\`\`\`typescript\n// Add code context here if needed\n\`\`\`\n\n`;
    });

    return markdown;
}

function main(): void {
    try {
        const args = process.argv.slice(2);
        if (args.length !== 2) {
            console.error('Usage: ts-node script.ts <source-file> <output-md-file>');
            process.exit(1);
        }

        const [sourceFile, outputFile] = args;

        if (!fs.existsSync(sourceFile)) {
            console.error(`Error: Source file '${sourceFile}' does not exist`);
            process.exit(1);
        }

        const errors = getTypeScriptErrors(sourceFile);
        const markdown = generateMarkdown(errors, sourceFile);
        
        fs.writeFileSync(outputFile, markdown);
        console.log(`Successfully generated error report at: ${outputFile}`);
        
        if (errors.length > 0) {
            console.log(`Found ${errors.length} error${errors.length === 1 ? '' : 's'}`);
        } else {
            console.log('No errors found!');
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error generating report:', error.message);
        } else {
            console.error('An unknown error occurred');
        }
        process.exit(1);
    }
}

main();