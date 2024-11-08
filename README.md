# Documentation for: olimpia-app-v3

Generated on: 2024-11-08 19:17:46

## Directory Structure

```
olimpia-app-v3/
│   ├── .env.local
│   ├── .eslintrc.json
│   ├── README.md
│   ├── components.json
│   ├── generate_docs.py
│   ├── middleware.ts
│   ├── next-env.d.ts
│   ├── next.config.ts
│   ├── package.json
│   ├── postcss.config.mjs
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── yarn.lock
│   ├── utils.ts
│   ├── use-toast.ts
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
    ├── dashboard/
    │   ├── layout.tsx
    │   ├── page.tsx
        ├── users/
        │   ├── page.tsx
        ├── images/
        │   ├── page.tsx
    ├── fonts/
    │   ├── GeistMonoVF.woff
    │   ├── GeistVF.woff
    ├── (auth)/
    │   ├── layout.tsx
        ├── invite/
        │   ├── page.tsx
        ├── login/
        │   ├── page.tsx
        ├── signup/
        │   ├── page.tsx
    ├── api/
        ├── auth/
            ├── callback/
            │   ├── route.ts
            ├── signout/
            │   ├── route.ts
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   ├── window.svg
    ├── lib/
    │   ├── utils.ts
        ├── supabase/
        │   ├── client.ts
        │   ├── server.ts
        │   ├── types.ts
    ├── components/
        ├── ui/
        │   ├── alert-dialog.tsx
        │   ├── button.tsx
        │   ├── card.tsx
        │   ├── dialog.tsx
        │   ├── dropdown-menu.tsx
        │   ├── form.tsx
        │   ├── input.tsx
        │   ├── label.tsx
        │   ├── table.tsx
        │   ├── toast.tsx
        │   ├── toaster.tsx
        │   ├── use-toast.tsx
        ├── data/
        │   ├── data-entry.tsx
        │   ├── data-management.tsx
        │   ├── data-table.tsx
        │   ├── edit-form.tsx
        │   ├── table-actions.tsx
        ├── users/
        │   ├── invite-user.tsx
        │   ├── users-table.tsx
        ├── image/
        │   ├── ImageUpload.tsx
        │   ├── types.ts
        │   ├── utils.ts
        ├── auth/
        │   ├── invite-form.tsx
        │   ├── login-form.tsx
        │   ├── signup-form.tsx
```

## File Contents

### .env.local

```local
NEXT_PUBLIC_SUPABASE_URL=https://kvfrbrkjfdgepqdmxwqg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2ZnJicmtqZmRnZXBxZG14d3FnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA5OTg5NjMsImV4cCI6MjA0NjU3NDk2M30.CWjggN0A7jeIcqf5W943anpOoSTR0-iO4xy9GfhVyik
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2ZnJicmtqZmRnZXBxZG14d3FnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMDk5ODk2MywiZXhwIjoyMDQ2NTc0OTYzfQ.eyLHrveSNOIWmd1peTSxHE1nColfTm2XnHSMFZq9XmY
```

### .eslintrc.json

```json
{
  "extends": ["next/core-web-vitals", "next/typescript"]
}

```

### README.md

```md

```

### components.json

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

### generate_docs.py

```py
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
```

### middleware.ts

```typescript
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Refresh session if expired - this will automatically handle token refresh
  const { data: { session } } = await supabase.auth.getSession()

  // Optional: Redirect to login if accessing protected routes without session
  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return res
}

// Specify which routes should be handled by the middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
```

### next-env.d.ts

```typescript
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/building-your-application/configuring/typescript for more information.

```

### next.config.ts

```typescript
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  typescript: {
    ignoreBuildErrors: false,
  },
}
export default nextConfig;

```

### package.json

```json
{
  "name": "olimpia-app-v3",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "ui": "shadcn-ui"
  },
  "dependencies": {
    "@hookform/resolvers": "^3.9.1",
    "@radix-ui/react-alert-dialog": "^1.1.2",
    "@radix-ui/react-dialog": "^1.1.2",
    "@radix-ui/react-dropdown-menu": "^2.1.2",
    "@radix-ui/react-label": "^2.1.0",
    "@radix-ui/react-slot": "^1.1.0",
    "@radix-ui/react-toast": "^1.2.2",
    "@supabase/auth-helpers-nextjs": "^0.10.0",
    "@supabase/supabase-js": "^2.46.1",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "lucide-react": "^0.454.0",
    "next": "15.0.3",
    "react": "19.0.0-rc-66855b96-20241106",
    "react-dom": "19.0.0-rc-66855b96-20241106",
    "react-hook-form": "^7.53.1",
    "tailwind-merge": "^2.5.4",
    "tailwindcss-animate": "^1.0.7",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@shadcn/ui": "^0.0.4",
    "@types/node": "^22.9.0",
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "autoprefixer": "^10.4.20",
    "eslint": "^8",
    "eslint-config-next": "15.0.3",
    "postcss": "^8.4.47",
    "prettier": "^3.3.3",
    "prettier-plugin-tailwindcss": "^0.6.8",
    "tailwindcss": "^3.4.14",
    "typescript": "^5"
  }
}

```

### postcss.config.mjs

```mjs
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
  },
};

export default config;

```

### tailwind.config.ts

```typescript
import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### yarn.lock

```lock
# THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
# yarn lockfile v1


"@alloc/quick-lru@^5.2.0":
  version "5.2.0"
  resolved "https://registry.yarnpkg.com/@alloc/quick-lru/-/quick-lru-5.2.0.tgz#7bf68b20c0a350f936915fcae06f58e32007ce30"
  integrity sha512-UrcABB+4bUrFABwbluTIBErXwvbsU/V7TZWfmbgJfbkwiBuziS9gxdODUyuiecfdGQ85jglMW6juS3+z5TsKLw==

"@emnapi/runtime@^1.2.0":
  version "1.3.1"
  resolved "https://registry.yarnpkg.com/@emnapi/runtime/-/runtime-1.3.1.tgz#0fcaa575afc31f455fd33534c19381cfce6c6f60"
  integrity sha512-kEBmG8KyqtxJZv+ygbEim+KCGtIq1fC22Ms3S4ziXmYKm8uyoLX0MHONVKwp+9opg390VaKRNt4a7A9NwmpNhw==
  dependencies:
    tslib "^2.4.0"

"@eslint-community/eslint-utils@^4.2.0", "@eslint-community/eslint-utils@^4.4.0":
  version "4.4.1"
  resolved "https://registry.yarnpkg.com/@eslint-community/eslint-utils/-/eslint-utils-4.4.1.tgz#d1145bf2c20132d6400495d6df4bf59362fd9d56"
  integrity sha512-s3O3waFUrMV8P/XaF/+ZTp1X9XBZW1a4B97ZnjQF2KYWaFD2A8KyFBsrsfSjEmjn3RGWAIuvlneuZm3CUK3jbA==
  dependencies:
    eslint-visitor-keys "^3.4.3"

"@eslint-community/regexpp@^4.10.0", "@eslint-community/regexpp@^4.6.1":
  version "4.12.1"
  resolved "https://registry.yarnpkg.com/@eslint-community/regexpp/-/regexpp-4.12.1.tgz#cfc6cffe39df390a3841cde2abccf92eaa7ae0e0"
  integrity sha512-CCZCDJuduB9OUkFkY2IgppNZMi2lBQgD2qzwXkEia16cge2pijY/aXi96CJMquDMn3nJdlPV1A5KrJEXwfLNzQ==

"@eslint/eslintrc@^2.1.4":
  version "2.1.4"
  resolved "https://registry.yarnpkg.com/@eslint/eslintrc/-/eslintrc-2.1.4.tgz#388a269f0f25c1b6adc317b5a2c55714894c70ad"
  integrity sha512-269Z39MS6wVJtsoUl10L60WdkhJVdPG24Q4eZTH3nnF6lpvSShEK3wQjDX9JRWAUPvPh7COouPpU9IrqaZFvtQ==
  dependencies:
    ajv "^6.12.4"
    debug "^4.3.2"
    espree "^9.6.0"
    globals "^13.19.0"
    ignore "^5.2.0"
    import-fresh "^3.2.1"
    js-yaml "^4.1.0"
    minimatch "^3.1.2"
    strip-json-comments "^3.1.1"

"@eslint/js@8.57.1":
  version "8.57.1"
  resolved "https://registry.yarnpkg.com/@eslint/js/-/js-8.57.1.tgz#de633db3ec2ef6a3c89e2f19038063e8a122e2c2"
  integrity sha512-d9zaMRSTIKDLhctzH12MtXvJKSSUhaHcjV+2Z+GK+EEY7XKpP5yR4x+N3TAcHTcu963nIr+TMcCb4DBCYX1z6Q==

"@floating-ui/core@^1.6.0":
  version "1.6.8"
  resolved "https://registry.yarnpkg.com/@floating-ui/core/-/core-1.6.8.tgz#aa43561be075815879305965020f492cdb43da12"
  integrity sha512-7XJ9cPU+yI2QeLS+FCSlqNFZJq8arvswefkZrYI1yQBbftw6FyrZOxYSh+9S7z7TpeWlRt9zJ5IhM1WIL334jA==
  dependencies:
    "@floating-ui/utils" "^0.2.8"

"@floating-ui/dom@^1.0.0":
  version "1.6.12"
  resolved "https://registry.yarnpkg.com/@floating-ui/dom/-/dom-1.6.12.tgz#6333dcb5a8ead3b2bf82f33d6bc410e95f54e556"
  integrity sha512-NP83c0HjokcGVEMeoStg317VD9W7eDlGK7457dMBANbKA6GJZdc7rjujdgqzTaz93jkGgc5P/jeWbaCHnMNc+w==
  dependencies:
    "@floating-ui/core" "^1.6.0"
    "@floating-ui/utils" "^0.2.8"

"@floating-ui/react-dom@^2.0.0":
  version "2.1.2"
  resolved "https://registry.yarnpkg.com/@floating-ui/react-dom/-/react-dom-2.1.2.tgz#a1349bbf6a0e5cb5ded55d023766f20a4d439a31"
  integrity sha512-06okr5cgPzMNBy+Ycse2A6udMi4bqwW/zgBF/rwjcNqWkyr82Mcg8b0vjX8OJpZFy/FKjJmw6wV7t44kK6kW7A==
  dependencies:
    "@floating-ui/dom" "^1.0.0"

"@floating-ui/utils@^0.2.8":
  version "0.2.8"
  resolved "https://registry.yarnpkg.com/@floating-ui/utils/-/utils-0.2.8.tgz#21a907684723bbbaa5f0974cf7730bd797eb8e62"
  integrity sha512-kym7SodPp8/wloecOpcmSnWJsK7M0E5Wg8UcFA+uO4B9s5d0ywXOEro/8HM9x0rW+TljRzul/14UYz3TleT3ig==

"@hookform/resolvers@^3.9.1":
  version "3.9.1"
  resolved "https://registry.yarnpkg.com/@hookform/resolvers/-/resolvers-3.9.1.tgz#a23883c40bfd449cb6c6ab5a0fa0729184c950ff"
  integrity sha512-ud2HqmGBM0P0IABqoskKWI6PEf6ZDDBZkFqe2Vnl+mTHCEHzr3ISjjZyCwTjC/qpL25JC9aIDkloQejvMeq0ug==

"@humanwhocodes/config-array@^0.13.0":
  version "0.13.0"
  resolved "https://registry.yarnpkg.com/@humanwhocodes/config-array/-/config-array-0.13.0.tgz#fb907624df3256d04b9aa2df50d7aa97ec648748"
  integrity sha512-DZLEEqFWQFiyK6h5YIeynKx7JlvCYWL0cImfSRXZ9l4Sg2efkFGTuFf6vzXjK1cq6IYkU+Eg/JizXw+TD2vRNw==
  dependencies:
    "@humanwhocodes/object-schema" "^2.0.3"
    debug "^4.3.1"
    minimatch "^3.0.5"

"@humanwhocodes/module-importer@^1.0.1":
  version "1.0.1"
  resolved "https://registry.yarnpkg.com/@humanwhocodes/module-importer/-/module-importer-1.0.1.tgz#af5b2691a22b44be847b0ca81641c5fb6ad0172c"
  integrity sha512-bxveV4V8v5Yb4ncFTT3rPSgZBOpCkjfK0y4oVVVJwIuDVBRMDXrPyXRL988i5ap9m9bnyEEjWfm5WkBmtffLfA==

"@humanwhocodes/object-schema@^2.0.3":
  version "2.0.3"
  resolved "https://registry.yarnpkg.com/@humanwhocodes/object-schema/-/object-schema-2.0.3.tgz#4a2868d75d6d6963e423bcf90b7fd1be343409d3"
  integrity sha512-93zYdMES/c1D69yZiKDBj0V24vqNzB/koF26KPaagAfd3P/4gUlh3Dys5ogAK+Exi9QyzlD8x/08Zt7wIKcDcA==

"@img/sharp-darwin-arm64@0.33.5":
  version "0.33.5"
  resolved "https://registry.yarnpkg.com/@img/sharp-darwin-arm64/-/sharp-darwin-arm64-0.33.5.tgz#ef5b5a07862805f1e8145a377c8ba6e98813ca08"
  integrity sha512-UT4p+iz/2H4twwAoLCqfA9UH5pI6DggwKEGuaPy7nCVQ8ZsiY5PIcrRvD1DzuY3qYL07NtIQcWnBSY/heikIFQ==
  optionalDependencies:
    "@img/sharp-libvips-darwin-arm64" "1.0.4"

"@img/sharp-darwin-x64@0.33.5":
  version "0.33.5"
  resolved "https://registry.yarnpkg.com/@img/sharp-darwin-x64/-/sharp-darwin-x64-0.33.5.tgz#e03d3451cd9e664faa72948cc70a403ea4063d61"
  integrity sha512-fyHac4jIc1ANYGRDxtiqelIbdWkIuQaI84Mv45KvGRRxSAa7o7d1ZKAOBaYbnepLC1WqxfpimdeWfvqqSGwR2Q==
  optionalDependencies:
    "@img/sharp-libvips-darwin-x64" "1.0.4"

"@img/sharp-libvips-darwin-arm64@1.0.4":
  version "1.0.4"
  resolved "https://registry.yarnpkg.com/@img/sharp-libvips-darwin-arm64/-/sharp-libvips-darwin-arm64-1.0.4.tgz#447c5026700c01a993c7804eb8af5f6e9868c07f"
  integrity sha512-XblONe153h0O2zuFfTAbQYAX2JhYmDHeWikp1LM9Hul9gVPjFY427k6dFEcOL72O01QxQsWi761svJ/ev9xEDg==

"@img/sharp-libvips-darwin-x64@1.0.4":
  version "1.0.4"
  resolved "https://registry.yarnpkg.com/@img/sharp-libvips-darwin-x64/-/sharp-libvips-darwin-x64-1.0.4.tgz#e0456f8f7c623f9dbfbdc77383caa72281d86062"
  integrity sha512-xnGR8YuZYfJGmWPvmlunFaWJsb9T/AO2ykoP3Fz/0X5XV2aoYBPkX6xqCQvUTKKiLddarLaxpzNe+b1hjeWHAQ==

"@img/sharp-libvips-linux-arm64@1.0.4":
  version "1.0.4"
  resolved "https://registry.yarnpkg.com/@img/sharp-libvips-linux-arm64/-/sharp-libvips-linux-arm64-1.0.4.tgz#979b1c66c9a91f7ff2893556ef267f90ebe51704"
  integrity sha512-9B+taZ8DlyyqzZQnoeIvDVR/2F4EbMepXMc/NdVbkzsJbzkUjhXv/70GQJ7tdLA4YJgNP25zukcxpX2/SueNrA==

"@img/sharp-libvips-linux-arm@1.0.5":
  version "1.0.5"
  resolved "https://registry.yarnpkg.com/@img/sharp-libvips-linux-arm/-/sharp-libvips-linux-arm-1.0.5.tgz#99f922d4e15216ec205dcb6891b721bfd2884197"
  integrity sha512-gvcC4ACAOPRNATg/ov8/MnbxFDJqf/pDePbBnuBDcjsI8PssmjoKMAz4LtLaVi+OnSb5FK/yIOamqDwGmXW32g==

"@img/sharp-libvips-linux-s390x@1.0.4":
  version "1.0.4"
  resolved "https://registry.yarnpkg.com/@img/sharp-libvips-linux-s390x/-/sharp-libvips-linux-s390x-1.0.4.tgz#f8a5eb1f374a082f72b3f45e2fb25b8118a8a5ce"
  integrity sha512-u7Wz6ntiSSgGSGcjZ55im6uvTrOxSIS8/dgoVMoiGE9I6JAfU50yH5BoDlYA1tcuGS7g/QNtetJnxA6QEsCVTA==

"@img/sharp-libvips-linux-x64@1.0.4":
  version "1.0.4"
  resolved "https://registry.yarnpkg.com/@img/sharp-libvips-linux-x64/-/sharp-libvips-linux-x64-1.0.4.tgz#d4c4619cdd157774906e15770ee119931c7ef5e0"
  integrity sha512-MmWmQ3iPFZr0Iev+BAgVMb3ZyC4KeFc3jFxnNbEPas60e1cIfevbtuyf9nDGIzOaW9PdnDciJm+wFFaTlj5xYw==

"@img/sharp-libvips-linuxmusl-arm64@1.0.4":
  version "1.0.4"
  resolved "https://registry.yarnpkg.com/@img/sharp-libvips-linuxmusl-arm64/-/sharp-libvips-linuxmusl-arm64-1.0.4.tgz#166778da0f48dd2bded1fa3033cee6b588f0d5d5"
  integrity sha512-9Ti+BbTYDcsbp4wfYib8Ctm1ilkugkA/uscUn6UXK1ldpC1JjiXbLfFZtRlBhjPZ5o1NCLiDbg8fhUPKStHoTA==

"@img/sharp-libvips-linuxmusl-x64@1.0.4":
  version "1.0.4"
  resolved "https://registry.yarnpkg.com/@img/sharp-libvips-linuxmusl-x64/-/sharp-libvips-linuxmusl-x64-1.0.4.tgz#93794e4d7720b077fcad3e02982f2f1c246751ff"
  integrity sha512-viYN1KX9m+/hGkJtvYYp+CCLgnJXwiQB39damAO7WMdKWlIhmYTfHjwSbQeUK/20vY154mwezd9HflVFM1wVSw==

"@img/sharp-linux-arm64@0.33.5":
  version "0.33.5"
  resolved "https://registry.yarnpkg.com/@img/sharp-linux-arm64/-/sharp-linux-arm64-0.33.5.tgz#edb0697e7a8279c9fc829a60fc35644c4839bb22"
  integrity sha512-JMVv+AMRyGOHtO1RFBiJy/MBsgz0x4AWrT6QoEVVTyh1E39TrCUpTRI7mx9VksGX4awWASxqCYLCV4wBZHAYxA==
  optionalDependencies:
    "@img/sharp-libvips-linux-arm64" "1.0.4"

"@img/sharp-linux-arm@0.33.5":
  version "0.33.5"
  resolved "https://registry.yarnpkg.com/@img/sharp-linux-arm/-/sharp-linux-arm-0.33.5.tgz#422c1a352e7b5832842577dc51602bcd5b6f5eff"
  integrity sha512-JTS1eldqZbJxjvKaAkxhZmBqPRGmxgu+qFKSInv8moZ2AmT5Yib3EQ1c6gp493HvrvV8QgdOXdyaIBrhvFhBMQ==
  optionalDependencies:
    "@img/sharp-libvips-linux-arm" "1.0.5"

"@img/sharp-linux-s390x@0.33.5":
  version "0.33.5"
  resolved "https://registry.yarnpkg.com/@img/sharp-linux-s390x/-/sharp-linux-s390x-0.33.5.tgz#f5c077926b48e97e4a04d004dfaf175972059667"
  integrity sha512-y/5PCd+mP4CA/sPDKl2961b+C9d+vPAveS33s6Z3zfASk2j5upL6fXVPZi7ztePZ5CuH+1kW8JtvxgbuXHRa4Q==
  optionalDependencies:
    "@img/sharp-libvips-linux-s390x" "1.0.4"

"@img/sharp-linux-x64@0.33.5":
  version "0.33.5"
  resolved "https://registry.yarnpkg.com/@img/sharp-linux-x64/-/sharp-linux-x64-0.33.5.tgz#d806e0afd71ae6775cc87f0da8f2d03a7c2209cb"
  integrity sha512-opC+Ok5pRNAzuvq1AG0ar+1owsu842/Ab+4qvU879ippJBHvyY5n2mxF1izXqkPYlGuP/M556uh53jRLJmzTWA==
  optionalDependencies:
    "@img/sharp-libvips-linux-x64" "1.0.4"

"@img/sharp-linuxmusl-arm64@0.33.5":
  version "0.33.5"
  resolved "https://registry.yarnpkg.com/@img/sharp-linuxmusl-arm64/-/sharp-linuxmusl-arm64-0.33.5.tgz#252975b915894fb315af5deea174651e208d3d6b"
  integrity sha512-XrHMZwGQGvJg2V/oRSUfSAfjfPxO+4DkiRh6p2AFjLQztWUuY/o8Mq0eMQVIY7HJ1CDQUJlxGGZRw1a5bqmd1g==
  optionalDependencies:
    "@img/sharp-libvips-linuxmusl-arm64" "1.0.4"

"@img/sharp-linuxmusl-x64@0.33.5":
  version "0.33.5"
  resolved "https://registry.yarnpkg.com/@img/sharp-linuxmusl-x64/-/sharp-linuxmusl-x64-0.33.5.tgz#3f4609ac5d8ef8ec7dadee80b560961a60fd4f48"
  integrity sha512-WT+d/cgqKkkKySYmqoZ8y3pxx7lx9vVejxW/W4DOFMYVSkErR+w7mf2u8m/y4+xHe7yY9DAXQMWQhpnMuFfScw==
  optionalDependencies:
    "@img/sharp-libvips-linuxmusl-x64" "1.0.4"

"@img/sharp-wasm32@0.33.5":
  version "0.33.5"
  resolved "https://registry.yarnpkg.com/@img/sharp-wasm32/-/sharp-wasm32-0.33.5.tgz#6f44f3283069d935bb5ca5813153572f3e6f61a1"
  integrity sha512-ykUW4LVGaMcU9lu9thv85CbRMAwfeadCJHRsg2GmeRa/cJxsVY9Rbd57JcMxBkKHag5U/x7TSBpScF4U8ElVzg==
  dependencies:
    "@emnapi/runtime" "^1.2.0"

"@img/sharp-win32-ia32@0.33.5":
  version "0.33.5"
  resolved "https://registry.yarnpkg.com/@img/sharp-win32-ia32/-/sharp-win32-ia32-0.33.5.tgz#1a0c839a40c5351e9885628c85f2e5dfd02b52a9"
  integrity sha512-T36PblLaTwuVJ/zw/LaH0PdZkRz5rd3SmMHX8GSmR7vtNSP5Z6bQkExdSK7xGWyxLw4sUknBuugTelgw2faBbQ==

"@img/sharp-win32-x64@0.33.5":
  version "0.33.5"
  resolved "https://registry.yarnpkg.com/@img/sharp-win32-x64/-/sharp-win32-x64-0.33.5.tgz#56f00962ff0c4e0eb93d34a047d29fa995e3e342"
  integrity sha512-MpY/o8/8kj+EcnxwvrP4aTJSWw/aZ7JIGR4aBeZkZw5B7/Jn+tY9/VNwtcoGmdT7GfggGIU4kygOMSbYnOrAbg==

"@isaacs/cliui@^8.0.2":
  version "8.0.2"
  resolved "https://registry.yarnpkg.com/@isaacs/cliui/-/cliui-8.0.2.tgz#b37667b7bc181c168782259bab42474fbf52b550"
  integrity sha512-O8jcjabXaleOG9DQ0+ARXWZBTfnP4WNAqzuiJK7ll44AmxGKv/J2M4TPjxjY3znBCfvBXFzucm1twdyFybFqEA==
  dependencies:
    string-width "^5.1.2"
    string-width-cjs "npm:string-width@^4.2.0"
    strip-ansi "^7.0.1"
    strip-ansi-cjs "npm:strip-ansi@^6.0.1"
    wrap-ansi "^8.1.0"
    wrap-ansi-cjs "npm:wrap-ansi@^7.0.0"

"@jridgewell/gen-mapping@^0.3.2":
  version "0.3.5"
  resolved "https://registry.yarnpkg.com/@jridgewell/gen-mapping/-/gen-mapping-0.3.5.tgz#dcce6aff74bdf6dad1a95802b69b04a2fcb1fb36"
  integrity sha512-IzL8ZoEDIBRWEzlCcRhOaCupYyN5gdIK+Q6fbFdPDg6HqX6jpkItn7DFIpW9LQzXG6Df9sA7+OKnq0qlz/GaQg==
  dependencies:
    "@jridgewell/set-array" "^1.2.1"
    "@jridgewell/sourcemap-codec" "^1.4.10"
    "@jridgewell/trace-mapping" "^0.3.24"

"@jridgewell/resolve-uri@^3.1.0":
  version "3.1.2"
  resolved "https://registry.yarnpkg.com/@jridgewell/resolve-uri/-/resolve-uri-3.1.2.tgz#7a0ee601f60f99a20c7c7c5ff0c80388c1189bd6"
  integrity sha512-bRISgCIjP20/tbWSPWMEi54QVPRZExkuD9lJL+UIxUKtwVJA8wW1Trb1jMs1RFXo1CBTNZ/5hpC9QvmKWdopKw==

"@jridgewell/set-array@^1.2.1":
  version "1.2.1"
  resolved "https://registry.yarnpkg.com/@jridgewell/set-array/-/set-array-1.2.1.tgz#558fb6472ed16a4c850b889530e6b36438c49280"
  integrity sha512-R8gLRTZeyp03ymzP/6Lil/28tGeGEzhx1q2k703KGWRAI1VdvPIXdG70VJc2pAMw3NA6JKL5hhFu1sJX0Mnn/A==

"@jridgewell/sourcemap-codec@^1.4.10", "@jridgewell/sourcemap-codec@^1.4.14":
  version "1.5.0"
  resolved "https://registry.yarnpkg.com/@jridgewell/sourcemap-codec/-/sourcemap-codec-1.5.0.tgz#3188bcb273a414b0d215fd22a58540b989b9409a"
  integrity sha512-gv3ZRaISU3fjPAgNsriBRqGWQL6quFx04YMPW/zD8XMLsU32mhCCbfbO6KZFLjvYpCZ8zyDEgqsgf+PwPaM7GQ==

"@jridgewell/trace-mapping@^0.3.24":
  version "0.3.25"
  resolved "https://registry.yarnpkg.com/@jridgewell/trace-mapping/-/trace-mapping-0.3.25.tgz#15f190e98895f3fc23276ee14bc76b675c2e50f0"
  integrity sha512-vNk6aEwybGtawWmy/PzwnGDOjCkLWSD2wqvjGGAgOAwCGWySYXfYoxt00IJkTF+8Lb57DwOb3Aa0o9CApepiYQ==
  dependencies:
    "@jridgewell/resolve-uri" "^3.1.0"
    "@jridgewell/sourcemap-codec" "^1.4.14"

"@next/env@15.0.3":
  version "15.0.3"
  resolved "https://registry.yarnpkg.com/@next/env/-/env-15.0.3.tgz#a2e9bf274743c52b74d30f415f3eba750d51313a"
  integrity sha512-t9Xy32pjNOvVn2AS+Utt6VmyrshbpfUMhIjFO60gI58deSo/KgLOp31XZ4O+kY/Is8WAGYwA5gR7kOb1eORDBA==

"@next/eslint-plugin-next@15.0.3":
  version "15.0.3"
  resolved "https://registry.yarnpkg.com/@next/eslint-plugin-next/-/eslint-plugin-next-15.0.3.tgz#ce953098036d462f6901e423cc6445fc165b78c4"
  integrity sha512-3Ln/nHq2V+v8uIaxCR6YfYo7ceRgZNXfTd3yW1ukTaFbO+/I8jNakrjYWODvG9BuR2v5kgVtH/C8r0i11quOgw==
  dependencies:
    fast-glob "3.3.1"

"@next/swc-darwin-arm64@15.0.3":
  version "15.0.3"
  resolved "https://registry.yarnpkg.com/@next/swc-darwin-arm64/-/swc-darwin-arm64-15.0.3.tgz#4c40c506cf3d4d87da0204f4cccf39e6bdc46a71"
  integrity sha512-s3Q/NOorCsLYdCKvQlWU+a+GeAd3C8Rb3L1YnetsgwXzhc3UTWrtQpB/3eCjFOdGUj5QmXfRak12uocd1ZiiQw==

"@next/swc-darwin-x64@15.0.3":
  version "15.0.3"
  resolved "https://registry.yarnpkg.com/@next/swc-darwin-x64/-/swc-darwin-x64-15.0.3.tgz#8e06cacae3dae279744f9fbe88dea679ec2c1ca3"
  integrity sha512-Zxl/TwyXVZPCFSf0u2BNj5sE0F2uR6iSKxWpq4Wlk/Sv9Ob6YCKByQTkV2y6BCic+fkabp9190hyrDdPA/dNrw==

"@next/swc-linux-arm64-gnu@15.0.3":
  version "15.0.3"
  resolved "https://registry.yarnpkg.com/@next/swc-linux-arm64-gnu/-/swc-linux-arm64-gnu-15.0.3.tgz#c144ad1f21091b9c6e1e330ecc2d56188763191d"
  integrity sha512-T5+gg2EwpsY3OoaLxUIofmMb7ohAUlcNZW0fPQ6YAutaWJaxt1Z1h+8zdl4FRIOr5ABAAhXtBcpkZNwUcKI2fw==

"@next/swc-linux-arm64-musl@15.0.3":
  version "15.0.3"
  resolved "https://registry.yarnpkg.com/@next/swc-linux-arm64-musl/-/swc-linux-arm64-musl-15.0.3.tgz#3ccb71c6703bf421332f177d1bb0e10528bc73a2"
  integrity sha512-WkAk6R60mwDjH4lG/JBpb2xHl2/0Vj0ZRu1TIzWuOYfQ9tt9NFsIinI1Epma77JVgy81F32X/AeD+B2cBu/YQA==

"@next/swc-linux-x64-gnu@15.0.3":
  version "15.0.3"
  resolved "https://registry.yarnpkg.com/@next/swc-linux-x64-gnu/-/swc-linux-x64-gnu-15.0.3.tgz#b90aa9b07001b4000427c35ab347a9273cbeebb3"
  integrity sha512-gWL/Cta1aPVqIGgDb6nxkqy06DkwJ9gAnKORdHWX1QBbSZZB+biFYPFti8aKIQL7otCE1pjyPaXpFzGeG2OS2w==

"@next/swc-linux-x64-musl@15.0.3":
  version "15.0.3"
  resolved "https://registry.yarnpkg.com/@next/swc-linux-x64-musl/-/swc-linux-x64-musl-15.0.3.tgz#0ac9724fb44718fc97bfea971ac3fe17e486590e"
  integrity sha512-QQEMwFd8r7C0GxQS62Zcdy6GKx999I/rTO2ubdXEe+MlZk9ZiinsrjwoiBL5/57tfyjikgh6GOU2WRQVUej3UA==

"@next/swc-win32-arm64-msvc@15.0.3":
  version "15.0.3"
  resolved "https://registry.yarnpkg.com/@next/swc-win32-arm64-msvc/-/swc-win32-arm64-msvc-15.0.3.tgz#932437d4cf27814e963ba8ae5f033b4421fab9ca"
  integrity sha512-9TEp47AAd/ms9fPNgtgnT7F3M1Hf7koIYYWCMQ9neOwjbVWJsHZxrFbI3iEDJ8rf1TDGpmHbKxXf2IFpAvheIQ==

"@next/swc-win32-x64-msvc@15.0.3":
  version "15.0.3"
  resolved "https://registry.yarnpkg.com/@next/swc-win32-x64-msvc/-/swc-win32-x64-msvc-15.0.3.tgz#940a6f7b370cdde0cc67eabe945d9e6d97e0be9f"
  integrity sha512-VNAz+HN4OGgvZs6MOoVfnn41kBzT+M+tB+OK4cww6DNyWS6wKaDpaAm/qLeOUbnMh0oVx1+mg0uoYARF69dJyA==

"@nodelib/fs.scandir@2.1.5":
  version "2.1.5"
  resolved "https://registry.yarnpkg.com/@nodelib/fs.scandir/-/fs.scandir-2.1.5.tgz#7619c2eb21b25483f6d167548b4cfd5a7488c3d5"
  integrity sha512-vq24Bq3ym5HEQm2NKCr3yXDwjc7vTsEThRDnkp2DK9p1uqLR+DHurm/NOTo0KG7HYHU7eppKZj3MyqYuMBf62g==
  dependencies:
    "@nodelib/fs.stat" "2.0.5"
    run-parallel "^1.1.9"

"@nodelib/fs.stat@2.0.5", "@nodelib/fs.stat@^2.0.2":
  version "2.0.5"
  resolved "https://registry.yarnpkg.com/@nodelib/fs.stat/-/fs.stat-2.0.5.tgz#5bd262af94e9d25bd1e71b05deed44876a222e8b"
  integrity sha512-RkhPPp2zrqDAQA/2jNhnztcPAlv64XdhIp7a7454A5ovI7Bukxgt7MX7udwAu3zg1DcpPU0rz3VV1SeaqvY4+A==

"@nodelib/fs.walk@^1.2.3", "@nodelib/fs.walk@^1.2.8":
  version "1.2.8"
  resolved "https://registry.yarnpkg.com/@nodelib/fs.walk/-/fs.walk-1.2.8.tgz#e95737e8bb6746ddedf69c556953494f196fe69a"
  integrity sha512-oGB+UxlgWcgQkgwo8GcEGwemoTFt3FIO9ababBmaGwXIoBKZ+GTy0pP185beGg7Llih/NSHSV2XAs1lnznocSg==
  dependencies:
    "@nodelib/fs.scandir" "2.1.5"
    fastq "^1.6.0"

"@nolyfill/is-core-module@1.0.39":
  version "1.0.39"
  resolved "https://registry.yarnpkg.com/@nolyfill/is-core-module/-/is-core-module-1.0.39.tgz#3dc35ba0f1e66b403c00b39344f870298ebb1c8e"
  integrity sha512-nn5ozdjYQpUCZlWGuxcJY/KpxkWQs4DcbMCmKojjyrYDEAGy4Ce19NN4v5MduafTwJlbKc99UA8YhSVqq9yPZA==

"@pkgjs/parseargs@^0.11.0":
  version "0.11.0"
  resolved "https://registry.yarnpkg.com/@pkgjs/parseargs/-/parseargs-0.11.0.tgz#a77ea742fab25775145434eb1d2328cf5013ac33"
  integrity sha512-+1VkjdD0QBLPodGrJUeqarH8VAIvQODIbwh9XpP5Syisf7YoQgsJKPNFoqqLQlu+VQ/tVSshMR6loPMn8U+dPg==

"@radix-ui/primitive@1.1.0":
  version "1.1.0"
  resolved "https://registry.yarnpkg.com/@radix-ui/primitive/-/primitive-1.1.0.tgz#42ef83b3b56dccad5d703ae8c42919a68798bbe2"
  integrity sha512-4Z8dn6Upk0qk4P74xBhZ6Hd/w0mPEzOOLxy4xiPXOXqjF7jZS0VAKk7/x/H6FyY2zCkYJqePf1G5KmkmNJ4RBA==

"@radix-ui/react-alert-dialog@^1.1.2":
  version "1.1.2"
  resolved "https://registry.yarnpkg.com/@radix-ui/react-alert-dialog/-/react-alert-dialog-1.1.2.tgz#ac3bb7f71f5cbb595d3d0949bb12b598c2a99981"
  integrity sha512-eGSlLzPhKO+TErxkiGcCZGuvbVMnLA1MTnyBksGOeGRGkxHiiJUujsjmNTdWTm4iHVSRaUao9/4Ur671auMghQ==
  dependencies:
    "@radix-ui/primitive" "1.1.0"
    "@radix-ui/react-compose-refs" "1.1.0"
    "@radix-ui/react-context" "1.1.1"
    "@radix-ui/react-dialog" "1.1.2"
    "@radix-ui/react-primitive" "2.0.0"
    "@radix-ui/react-slot" "1.1.0"

"@radix-ui/react-arrow@1.1.0":
  version "1.1.0"
  resolved "https://registry.yarnpkg.com/@radix-ui/react-arrow/-/react-arrow-1.1.0.tgz#744f388182d360b86285217e43b6c63633f39e7a"
  integrity sha512-FmlW1rCg7hBpEBwFbjHwCW6AmWLQM6g/v0Sn8XbP9NvmSZ2San1FpQeyPtufzOMSIx7Y4dzjlHoifhp+7NkZhw==
  dependencies:
    "@radix-ui/react-primitive" "2.0.0"

"@radix-ui/react-collection@1.1.0":
  version "1.1.0"
  resolved "https://registry.yarnpkg.com/@radix-ui/react-collection/-/react-collection-1.1.0.tgz#f18af78e46454a2360d103c2251773028b7724ed"
  integrity sha512-GZsZslMJEyo1VKm5L1ZJY8tGDxZNPAoUeQUIbKeJfoi7Q4kmig5AsgLMYYuyYbfjd8fBmFORAIwYAkXMnXZgZw==
  dependencies:
    "@radix-ui/react-compose-refs" "1.1.0"
    "@radix-ui/react-context" "1.1.0"
    "@radix-ui/react-primitive" "2.0.0"
    "@radix-ui/react-slot" "1.1.0"

"@radix-ui/react-compose-refs@1.1.0":
  version "1.1.0"
  resolved "https://registry.yarnpkg.com/@radix-ui/react-compose-refs/-/react-compose-refs-1.1.0.tgz#656432461fc8283d7b591dcf0d79152fae9ecc74"
  integrity sha512-b4inOtiaOnYf9KWyO3jAeeCG6FeyfY6ldiEPanbUjWd+xIk5wZeHa8yVwmrJ2vderhu/BQvzCrJI0lHd+wIiqw==

"@radix-ui/react-context@1.1.0":
  version "1.1.0"
  resolved "https://registry.yarnpkg.com/@radix-ui/react-context/-/react-context-1.1.0.tgz#6df8d983546cfd1999c8512f3a8ad85a6e7fcee8"
  integrity sha512-OKrckBy+sMEgYM/sMmqmErVn0kZqrHPJze+Ql3DzYsDDp0hl0L62nx/2122/Bvps1qz645jlcu2tD9lrRSdf8A==

"@radix-ui/react-context@1.1.1":
  version "1.1.1"
  resolved "https://registry.yarnpkg.com/@radix-ui/react-context/-/react-context-1.1.1.tgz#82074aa83a472353bb22e86f11bcbd1c61c4c71a"
  integrity sha512-UASk9zi+crv9WteK/NU4PLvOoL3OuE6BWVKNF6hPRBtYBDXQ2u5iu3O59zUlJiTVvkyuycnqrztsHVJwcK9K+Q==

"@radix-ui/react-dialog@1.1.2", "@radix-ui/react-dialog@^1.1.2":
  version "1.1.2"
  resolved "https://registry.yarnpkg.com/@radix-ui/react-dialog/-/react-dialog-1.1.2.tgz#d9345575211d6f2d13e209e84aec9a8584b54d6c"
  integrity sha512-Yj4dZtqa2o+kG61fzB0H2qUvmwBA2oyQroGLyNtBj1beo1khoQ3q1a2AO8rrQYjd8256CO9+N8L9tvsS+bnIyA==
  dependencies:
    "@radix-ui/primitive" "1.1.0"
    "@radix-ui/react-compose-refs" "1.1.0"
    "@radix-ui/react-context" "1.1.1"
    "@radix-ui/react-dismissable-layer" "1.1.1"
    "@radix-ui/react-focus-guards" "1.1.1"
    "@radix-ui/react-focus-scope" "1.1.0"
    "@radix-ui/react-id" "1.1.0"
    "@radix-ui/react-portal" "1.1.2"
    "@radix-ui/react-presence" "1.1.1"
    "@radix-ui/react-primitive" "2.0.0"
    "@radix-ui/react-slot" "1.1.0"
    "@radix-ui/react-use-controllable-state" "1.1.0"
    aria-hidden "^1.1.1"
    react-remove-scroll "2.6.0"

"@radix-ui/react-direction@1.1.0":
  version "1.1.0"
  resolved "https://registry.yarnpkg.com/@radix-ui/react-direction/-/react-direction-1.1.0.tgz#a7d39855f4d077adc2a1922f9c353c5977a09cdc"
  integrity sha512-BUuBvgThEiAXh2DWu93XsT+a3aWrGqolGlqqw5VU1kG7p/ZH2cuDlM1sRLNnY3QcBS69UIz2mcKhMxDsdewhjg==

"@radix-ui/react-dismissable-layer@1.1.1":
  version "1.1.1"
  resolved "https://registry.yarnpkg.com/@radix-ui/react-dismissable-layer/-/react-dismissable-layer-1.1.1.tgz#cbdcb739c5403382bdde5f9243042ba643883396"
  integrity sha512-QSxg29lfr/xcev6kSz7MAlmDnzbP1eI/Dwn3Tp1ip0KT5CUELsxkekFEMVBEoykI3oV39hKT4TKZzBNMbcTZYQ==
  dependencies:
    "@radix-ui/primitive" "1.1.0"
    "@radix-ui/react-compose-refs" "1.1.0"
    "@radix-ui/react-primitive" "2.0.0"
    "@radix-ui/react-use-callback-ref" "1.1.0"
    "@radix-ui/react-use-escape-keydown" "1.1.0"

"@radix-ui/react-dropdown-menu@^2.1.2":
  version "2.1.2"
  resolved "https://registry.yarnpkg.com/@radix-ui/react-dropdown-menu/-/react-dropdown-menu-2.1.2.tgz#acc49577130e3c875ef0133bd1e271ea3392d924"
  integrity sha512-GVZMR+eqK8/Kes0a36Qrv+i20bAPXSn8rCBTHx30w+3ECnR5o3xixAlqcVaYvLeyKUsm0aqyhWfmUcqufM8nYA==
  dependencies:
    "@radix-ui/primitive" "1.1.0"
    "@radix-ui/react-compose-refs" "1.1.0"
    "@radix-ui/react-context" "1.1.1"
    "@radix-ui/react-id" "1.1.0"
    "@radix-ui/react-menu" "2.1.2"
    "@radix-ui/react-primitive" "2.0.0"
    "@radix-ui/react-use-controllable-state" "1.1.0"

"@radix-ui/react-focus-guards@1.1.1":
  version "1.1.1"
  resolved "https://registry.yarnpkg.com/@radix-ui/react-focus-guards/-/react-focus-guards-1.1.1.tgz#8635edd346304f8b42cae86b05912b61aef27afe"
  integrity sha512-pSIwfrT1a6sIoDASCSpFwOasEwKTZWDw/iBdtnqKO7v6FeOzYJ7U53cPzYFVR3geGGXgVHaH+CdngrrAzqUGxg==

"@radix-ui/react-focus-scope@1.1.0":
  version "1.1.0"
  resolved "https://registry.yarnpkg.com/@radix-ui/react-focus-scope/-/react-focus-scope-1.1.0.tgz#ebe2891a298e0a33ad34daab2aad8dea31caf0b2"
  integrity sha512-200UD8zylvEyL8Bx+z76RJnASR2gRMuxlgFCPAe/Q/679a/r0eK3MBVYMb7vZODZcffZBdob1EGnky78xmVvcA==
  dependencies:
    "@radix-ui/react-compose-refs" "1.1.0"
    "@radix-ui/react-primitive" "2.0.0"
    "@radix-ui/react-use-callback-ref" "1.1.0"

"@radix-ui/react-id@1.1.0":
  version "1.1.0"
  resolved "https://registry.yarnpkg.com/@radix-ui/react-id/-/react-id-1.1.0.tgz#de47339656594ad722eb87f94a6b25f9cffae0ed"
  integrity sha512-EJUrI8yYh7WOjNOqpoJaf1jlFIH2LvtgAl+YcFqNCa+4hj64ZXmPkAKOFs/ukjz3byN6bdb/AVUqHkI8/uWWMA==
  dependencies:
    "@radix-ui/react-use-layout-effect" "1.1.0"

"@radix-ui/react-label@^2.1.0":
  version "2.1.0"
  resolved "https://registry.yarnpkg.com/@radix-ui/react-label/-/react-label-2.1.0.tgz#3aa2418d70bb242be37c51ff5e51a2adcbc372e3"
  integrity sha512-peLblDlFw/ngk3UWq0VnYaOLy6agTZZ+MUO/WhVfm14vJGML+xH4FAl2XQGLqdefjNb7ApRg6Yn7U42ZhmYXdw==
  dependencies:
    "@radix-ui/react-primitive" "2.0.0"

"@radix-ui/react-menu@2.1.2":
  version "2.1.2"
  resolved "https://registry.yarnpkg.com/@radix-ui/react-menu/-/react-menu-2.1.2.tgz#91f6815845a4298dde775563ed2d80b7ad667899"
  integrity sha512-lZ0R4qR2Al6fZ4yCCZzu/ReTFrylHFxIqy7OezIpWF4bL0o9biKo0pFIvkaew3TyZ9Fy5gYVrR5zCGZBVbO1zg==
  dependencies:
    "@radix-ui/primitive" "1.1.0"
    "@radix-ui/react-collection" "1.1.0"
    "@radix-ui/react-compose-refs" "1.1.0"
    "@radix-ui/react-context" "1.1.1"
    "@radix-ui/react-direction" "1.1.0"
    "@radix-ui/react-dismissable-layer" "1.1.1"
    "@radix-ui/react-focus-guards" "1.1.1"
    "@radix-ui/react-focus-scope" "1.1.0"
    "@radix-ui/react-id" "1.1.0"
    "@radix-ui/react-popper" "1.2.0"
    "@radix-ui/react-portal" "1.1.2"
    "@radix-ui/react-presence" "1.1.1"
    "@radix-ui/react-primitive" "2.0.0"
    "@radix-ui/react-roving-focus" "1.1.0"
    "@radix-ui/react-slot" "1.1.0"
    "@radix-ui/react-use-callback-ref" "1.1.0"
    aria-hidden "^1.1.1"
    react-remove-scroll "2.6.0"

"@radix-ui/react-popper@1.2.0":
  version "1.2.0"
  resolved "https://registry.yarnpkg.com/@radix-ui/react-popper/-/react-popper-1.2.0.tgz#a3e500193d144fe2d8f5d5e60e393d64111f2a7a"
  integrity sha512-ZnRMshKF43aBxVWPWvbj21+7TQCvhuULWJ4gNIKYpRlQt5xGRhLx66tMp8pya2UkGHTSlhpXwmjqltDYHhw7Vg==
  dependencies:
    "@floating-ui/react-dom" "^2.0.0"
    "@radix-ui/react-arrow" "1.1.0"
    "@radix-ui/react-compose-refs" "1.1.0"
    "@radix-ui/react-context" "1.1.0"
    "@radix-ui/react-primitive" "2.0.0"
    "@radix-ui/react-use-callback-ref" "1.1.0"
    "@radix-ui/react-use-layout-effect" "1.1.0"
    "@radix-ui/react-use-rect" "1.1.0"
    "@radix-ui/react-use-size" "1.1.0"
    "@radix-ui/rect" "1.1.0"

"@radix-ui/react-portal@1.1.2":
  version "1.1.2"
  resolved "https://registry.yarnpkg.com/@radix-ui/react-portal/-/react-portal-1.1.2.tgz#51eb46dae7505074b306ebcb985bf65cc547d74e"
  integrity sha512-WeDYLGPxJb/5EGBoedyJbT0MpoULmwnIPMJMSldkuiMsBAv7N1cRdsTWZWht9vpPOiN3qyiGAtbK2is47/uMFg==
  dependencies:
    "@radix-ui/react-primitive" "2.0.0"
    "@radix-ui/react-use-layout-effect" "1.1.0"

"@radix-ui/react-presence@1.1.1":
  version "1.1.1"
  resolved "https://registry.yarnpkg.com/@radix-ui/react-presence/-/react-presence-1.1.1.tgz#98aba423dba5e0c687a782c0669dcd99de17f9b1"
  integrity sha512-IeFXVi4YS1K0wVZzXNrbaaUvIJ3qdY+/Ih4eHFhWA9SwGR9UDX7Ck8abvL57C4cv3wwMvUE0OG69Qc3NCcTe/A==
  dependencies:
    "@radix-ui/react-compose-refs" "1.1.0"
    "@radix-ui/react-use-layout-effect" "1.1.0"

"@radix-ui/react-primitive@2.0.0":
  version "2.0.0"
  resolved "https://registry.yarnpkg.com/@radix-ui/react-primitive/-/react-primitive-2.0.0.tgz#fe05715faa9203a223ccc0be15dc44b9f9822884"
  integrity sha512-ZSpFm0/uHa8zTvKBDjLFWLo8dkr4MBsiDLz0g3gMUwqgLHz9rTaRRGYDgvZPtBJgYCBKXkS9fzmoySgr8CO6Cw==
  dependencies:
    "@radix-ui/react-slot" "1.1.0"

"@radix-ui/react-roving-focus@1.1.0":
  version "1.1.0"
  resolved "https://registry.yarnpkg.com/@radix-ui/react-roving-focus/-/react-roving-focus-1.1.0.tgz#b30c59daf7e714c748805bfe11c76f96caaac35e"
  integrity sha512-EA6AMGeq9AEeQDeSH0aZgG198qkfHSbvWTf1HvoDmOB5bBG/qTxjYMWUKMnYiV6J/iP/J8MEFSuB2zRU2n7ODA==
  dependencies:
    "@radix-ui/primitive" "1.1.0"
    "@radix-ui/react-collection" "1.1.0"
    "@radix-ui/react-compose-refs" "1.1.0"
    "@radix-ui/react-context" "1.1.0"
    "@radix-ui/react-direction" "1.1.0"
    "@radix-ui/react-id" "1.1.0"
    "@radix-ui/react-primitive" "2.0.0"
    "@radix-ui/react-use-callback-ref" "1.1.0"
    "@radix-ui/react-use-controllable-state" "1.1.0"

"@radix-ui/react-slot@1.1.0", "@radix-ui/react-slot@^1.1.0":
  version "1.1.0"
  resolved "https://registry.yarnpkg.com/@radix-ui/react-slot/-/react-slot-1.1.0.tgz#7c5e48c36ef5496d97b08f1357bb26ed7c714b84"
  integrity sha512-FUCf5XMfmW4dtYl69pdS4DbxKy8nj4M7SafBgPllysxmdachynNflAdp/gCsnYWNDnge6tI9onzMp5ARYc1KNw==
  dependencies:
    "@radix-ui/react-compose-refs" "1.1.0"

"@radix-ui/react-toast@^1.2.2":
  version "1.2.2"
  resolved "https://registry.yarnpkg.com/@radix-ui/react-toast/-/react-toast-1.2.2.tgz#fdd8ed0b80f47d6631dfd90278fee6debc06bf33"
  integrity sha512-Z6pqSzmAP/bFJoqMAston4eSNa+ud44NSZTiZUmUen+IOZ5nBY8kzuU5WDBVyFXPtcW6yUalOHsxM/BP6Sv8ww==
  dependencies:
    "@radix-ui/primitive" "1.1.0"
    "@radix-ui/react-collection" "1.1.0"
    "@radix-ui/react-compose-refs" "1.1.0"
    "@radix-ui/react-context" "1.1.1"
    "@radix-ui/react-dismissable-layer" "1.1.1"
    "@radix-ui/react-portal" "1.1.2"
    "@radix-ui/react-presence" "1.1.1"
    "@radix-ui/react-primitive" "2.0.0"
    "@radix-ui/react-use-callback-ref" "1.1.0"
    "@radix-ui/react-use-controllable-state" "1.1.0"
    "@radix-ui/react-use-layout-effect" "1.1.0"
    "@radix-ui/react-visually-hidden" "1.1.0"

"@radix-ui/react-use-callback-ref@1.1.0":
  version "1.1.0"
  resolved "https://registry.yarnpkg.com/@radix-ui/react-use-callback-ref/-/react-use-callback-ref-1.1.0.tgz#bce938ca413675bc937944b0d01ef6f4a6dc5bf1"
  integrity sha512-CasTfvsy+frcFkbXtSJ2Zu9JHpN8TYKxkgJGWbjiZhFivxaeW7rMeZt7QELGVLaYVfFMsKHjb7Ak0nMEe+2Vfw==

"@radix-ui/react-use-controllable-state@1.1.0":
  version "1.1.0"
  resolved "https://registry.yarnpkg.com/@radix-ui/react-use-controllable-state/-/react-use-controllable-state-1.1.0.tgz#1321446857bb786917df54c0d4d084877aab04b0"
  integrity sha512-MtfMVJiSr2NjzS0Aa90NPTnvTSg6C/JLCV7ma0W6+OMV78vd8OyRpID+Ng9LxzsPbLeuBnWBA1Nq30AtBIDChw==
  dependencies:
    "@radix-ui/react-use-callback-ref" "1.1.0"

"@radix-ui/react-use-escape-keydown@1.1.0":
  version "1.1.0"
  resolved "https://registry.yarnpkg.com/@radix-ui/react-use-escape-keydown/-/react-use-escape-keydown-1.1.0.tgz#31a5b87c3b726504b74e05dac1edce7437b98754"
  integrity sha512-L7vwWlR1kTTQ3oh7g1O0CBF3YCyyTj8NmhLR+phShpyA50HCfBFKVJTpshm9PzLiKmehsrQzTYTpX9HvmC9rhw==
  dependencies:
    "@radix-ui/react-use-callback-ref" "1.1.0"

"@radix-ui/react-use-layout-effect@1.1.0":
  version "1.1.0"
  resolved "https://registry.yarnpkg.com/@radix-ui/react-use-layout-effect/-/react-use-layout-effect-1.1.0.tgz#3c2c8ce04827b26a39e442ff4888d9212268bd27"
  integrity sha512-+FPE0rOdziWSrH9athwI1R0HDVbWlEhd+FR+aSDk4uWGmSJ9Z54sdZVDQPZAinJhJXwfT+qnj969mCsT2gfm5w==

"@radix-ui/react-use-rect@1.1.0":
  version "1.1.0"
  resolved "https://registry.yarnpkg.com/@radix-ui/react-use-rect/-/react-use-rect-1.1.0.tgz#13b25b913bd3e3987cc9b073a1a164bb1cf47b88"
  integrity sha512-0Fmkebhr6PiseyZlYAOtLS+nb7jLmpqTrJyv61Pe68MKYW6OWdRE2kI70TaYY27u7H0lajqM3hSMMLFq18Z7nQ==
  dependencies:
    "@radix-ui/rect" "1.1.0"

"@radix-ui/react-use-size@1.1.0":
  version "1.1.0"
  resolved "https://registry.yarnpkg.com/@radix-ui/react-use-size/-/react-use-size-1.1.0.tgz#b4dba7fbd3882ee09e8d2a44a3eed3a7e555246b"
  integrity sha512-XW3/vWuIXHa+2Uwcc2ABSfcCledmXhhQPlGbfcRXbiUQI5Icjcg19BGCZVKKInYbvUCut/ufbbLLPFC5cbb1hw==
  dependencies:
    "@radix-ui/react-use-layout-effect" "1.1.0"

"@radix-ui/react-visually-hidden@1.1.0":
  version "1.1.0"
  resolved "https://registry.yarnpkg.com/@radix-ui/react-visually-hidden/-/react-visually-hidden-1.1.0.tgz#ad47a8572580f7034b3807c8e6740cd41038a5a2"
  integrity sha512-N8MDZqtgCgG5S3aV60INAB475osJousYpZ4cTJ2cFbMpdHS5Y6loLTH8LPtkj2QN0x93J30HT/M3qJXM0+lyeQ==
  dependencies:
    "@radix-ui/react-primitive" "2.0.0"

"@radix-ui/rect@1.1.0":
  version "1.1.0"
  resolved "https://registry.yarnpkg.com/@radix-ui/rect/-/rect-1.1.0.tgz#f817d1d3265ac5415dadc67edab30ae196696438"
  integrity sha512-A9+lCBZoaMJlVKcRBz2YByCG+Cp2t6nAnMnNba+XiWxnj6r4JUFqfsgwocMBZU9LPtdxC6wB56ySYpc7LQIoJg==

"@rtsao/scc@^1.1.0":
  version "1.1.0"
  resolved "https://registry.yarnpkg.com/@rtsao/scc/-/scc-1.1.0.tgz#927dd2fae9bc3361403ac2c7a00c32ddce9ad7e8"
  integrity sha512-zt6OdqaDoOnJ1ZYsCYGt9YmWzDXl4vQdKTyJev62gFhRGKdx7mcT54V9KIjg+d2wi9EXsPvAPKe7i7WjfVWB8g==

"@rushstack/eslint-patch@^1.10.3":
  version "1.10.4"
  resolved "https://registry.yarnpkg.com/@rushstack/eslint-patch/-/eslint-patch-1.10.4.tgz#427d5549943a9c6fce808e39ea64dbe60d4047f1"
  integrity sha512-WJgX9nzTqknM393q1QJDJmoW28kUfEnybeTfVNcNAPnIx210RXm2DiXiHzfNPJNIUUb1tJnz/l4QGtJ30PgWmA==

"@shadcn/ui@^0.0.4":
  version "0.0.4"
  resolved "https://registry.yarnpkg.com/@shadcn/ui/-/ui-0.0.4.tgz#a0835202fa79073245bc2cb5f837bc514d96b4cb"
  integrity sha512-0dtu/5ApsOZ24qgaZwtif8jVwqol7a4m1x5AxPuM1k5wxhqU7t/qEfBGtaSki1R8VlbTQfCj5PAlO45NKCa7Gg==
  dependencies:
    chalk "5.2.0"
    commander "^10.0.0"
    execa "^7.0.0"
    fs-extra "^11.1.0"
    node-fetch "^3.3.0"
    ora "^6.1.2"
    prompts "^2.4.2"
    zod "^3.20.2"

"@supabase/auth-helpers-nextjs@^0.10.0":
  version "0.10.0"
  resolved "https://registry.yarnpkg.com/@supabase/auth-helpers-nextjs/-/auth-helpers-nextjs-0.10.0.tgz#e831968f95e1bc44f400825d251a8b2fda97ee9f"
  integrity sha512-2dfOGsM4yZt0oS4TPiE7bD4vf7EVz7NRz/IJrV6vLg0GP7sMUx8wndv2euLGq4BjN9lUCpu6DG/uCC8j+ylwPg==
  dependencies:
    "@supabase/auth-helpers-shared" "0.7.0"
    set-cookie-parser "^2.6.0"

"@supabase/auth-helpers-shared@0.7.0":
  version "0.7.0"
  resolved "https://registry.yarnpkg.com/@supabase/auth-helpers-shared/-/auth-helpers-shared-0.7.0.tgz#244a6b6ac39a5eb1bc8d69a57c25aa580cd0f669"
  integrity sha512-FBFf2ei2R7QC+B/5wWkthMha8Ca2bWHAndN+syfuEUUfufv4mLcAgBCcgNg5nJR8L0gZfyuaxgubtOc9aW3Cpg==
  dependencies:
    jose "^4.14.4"

"@supabase/auth-js@2.65.1":
  version "2.65.1"
  resolved "https://registry.yarnpkg.com/@supabase/auth-js/-/auth-js-2.65.1.tgz#4f6ab9ece2e6613d2648ecf5482800f3766479ea"
  integrity sha512-IA7i2Xq2SWNCNMKxwmPlHafBQda0qtnFr8QnyyBr+KaSxoXXqEzFCnQ1dGTy6bsZjVBgXu++o3qrDypTspaAPw==
  dependencies:
    "@supabase/node-fetch" "^2.6.14"

"@supabase/functions-js@2.4.3":
  version "2.4.3"
  resolved "https://registry.yarnpkg.com/@supabase/functions-js/-/functions-js-2.4.3.tgz#ac1c696d3a1ebe00f60d5cea69b208078678ef8b"
  integrity sha512-sOLXy+mWRyu4LLv1onYydq+10mNRQ4rzqQxNhbrKLTLTcdcmS9hbWif0bGz/NavmiQfPs4ZcmQJp4WqOXlR4AQ==
  dependencies:
    "@supabase/node-fetch" "^2.6.14"

"@supabase/node-fetch@2.6.15", "@supabase/node-fetch@^2.6.14":
  version "2.6.15"
  resolved "https://registry.yarnpkg.com/@supabase/node-fetch/-/node-fetch-2.6.15.tgz#731271430e276983191930816303c44159e7226c"
  integrity sha512-1ibVeYUacxWYi9i0cf5efil6adJ9WRyZBLivgjs+AUpewx1F3xPi7gLgaASI2SmIQxPoCEjAsLAzKPgMJVgOUQ==
  dependencies:
    whatwg-url "^5.0.0"

"@supabase/postgrest-js@1.16.3":
  version "1.16.3"
  resolved "https://registry.yarnpkg.com/@supabase/postgrest-js/-/postgrest-js-1.16.3.tgz#d8e009e63b9152e46715982a6d706f1450c0af0d"
  integrity sha512-HI6dsbW68AKlOPofUjDTaosiDBCtW4XAm0D18pPwxoW3zKOE2Ru13Z69Wuys9fd6iTpfDViNco5sgrtnP0666A==
  dependencies:
    "@supabase/node-fetch" "^2.6.14"

"@supabase/realtime-js@2.10.7":
  version "2.10.7"
  resolved "https://registry.yarnpkg.com/@supabase/realtime-js/-/realtime-js-2.10.7.tgz#9e0cbecdffbfda3ae94639dbe0e55b06c6f79290"
  integrity sha512-OLI0hiSAqQSqRpGMTUwoIWo51eUivSYlaNBgxsXZE7PSoWh12wPRdVt0psUMaUzEonSB85K21wGc7W5jHnT6uA==
  dependencies:
    "@supabase/node-fetch" "^2.6.14"
    "@types/phoenix" "^1.5.4"
    "@types/ws" "^8.5.10"
    ws "^8.14.2"

"@supabase/storage-js@2.7.1":
  version "2.7.1"
  resolved "https://registry.yarnpkg.com/@supabase/storage-js/-/storage-js-2.7.1.tgz#761482f237deec98a59e5af1ace18c7a5e0a69af"
  integrity sha512-asYHcyDR1fKqrMpytAS1zjyEfvxuOIp1CIXX7ji4lHHcJKqyk+sLl/Vxgm4sN6u8zvuUtae9e4kDxQP2qrwWBA==
  dependencies:
    "@supabase/node-fetch" "^2.6.14"

"@supabase/supabase-js@^2.46.1":
  version "2.46.1"
  resolved "https://registry.yarnpkg.com/@supabase/supabase-js/-/supabase-js-2.46.1.tgz#4d23cdf7b6aab45686dfe87577ca7d1371afd341"
  integrity sha512-HiBpd8stf7M6+tlr+/82L8b2QmCjAD8ex9YdSAKU+whB/SHXXJdus1dGlqiH9Umy9ePUuxaYmVkGd9BcvBnNvg==
  dependencies:
    "@supabase/auth-js" "2.65.1"
    "@supabase/functions-js" "2.4.3"
    "@supabase/node-fetch" "2.6.15"
    "@supabase/postgrest-js" "1.16.3"
    "@supabase/realtime-js" "2.10.7"
    "@supabase/storage-js" "2.7.1"

"@swc/counter@0.1.3":
  version "0.1.3"
  resolved "https://registry.yarnpkg.com/@swc/counter/-/counter-0.1.3.tgz#cc7463bd02949611c6329596fccd2b0ec782b0e9"
  integrity sha512-e2BR4lsJkkRlKZ/qCHPw9ZaSxc0MVUd7gtbtaB7aMvHeJVYe8sOB8DBZkP2DtISHGSku9sCK6T6cnY0CtXrOCQ==

"@swc/helpers@0.5.13":
  version "0.5.13"
  resolved "https://registry.yarnpkg.com/@swc/helpers/-/helpers-0.5.13.tgz#33e63ff3cd0cade557672bd7888a39ce7d115a8c"
  integrity sha512-UoKGxQ3r5kYI9dALKJapMmuK+1zWM/H17Z1+iwnNmzcJRnfFuevZs375TA5rW31pu4BS4NoSy1fRsexDXfWn5w==
  dependencies:
    tslib "^2.4.0"

"@types/json5@^0.0.29":
  version "0.0.29"
  resolved "https://registry.yarnpkg.com/@types/json5/-/json5-0.0.29.tgz#ee28707ae94e11d2b827bcbe5270bcea7f3e71ee"
  integrity sha512-dRLjCWHYg4oaA77cxO64oO+7JwCwnIzkZPdrrC71jQmQtlhM556pwKo5bUzqvZndkVbeFLIIi+9TC40JNF5hNQ==

"@types/node@*", "@types/node@^22.9.0":
  version "22.9.0"
  resolved "https://registry.yarnpkg.com/@types/node/-/node-22.9.0.tgz#b7f16e5c3384788542c72dc3d561a7ceae2c0365"
  integrity sha512-vuyHg81vvWA1Z1ELfvLko2c8f34gyA0zaic0+Rllc5lbCnbSyuvb2Oxpm6TAUAC/2xZN3QGqxBNggD1nNR2AfQ==
  dependencies:
    undici-types "~6.19.8"

"@types/phoenix@^1.5.4":
  version "1.6.5"
  resolved "https://registry.yarnpkg.com/@types/phoenix/-/phoenix-1.6.5.tgz#5654e14ec7ad25334a157a20015996b6d7d2075e"
  integrity sha512-xegpDuR+z0UqG9fwHqNoy3rI7JDlvaPh2TY47Fl80oq6g+hXT+c/LEuE43X48clZ6lOfANl5WrPur9fYO1RJ/w==

"@types/prop-types@*":
  version "15.7.13"
  resolved "https://registry.yarnpkg.com/@types/prop-types/-/prop-types-15.7.13.tgz#2af91918ee12d9d32914feb13f5326658461b451"
  integrity sha512-hCZTSvwbzWGvhqxp/RqVqwU999pBf2vp7hzIjiYOsl8wqOmUxkQ6ddw1cV3l8811+kdUFus/q4d1Y3E3SyEifA==

"@types/react-dom@^18.3.1":
  version "18.3.1"
  resolved "https://registry.yarnpkg.com/@types/react-dom/-/react-dom-18.3.1.tgz#1e4654c08a9cdcfb6594c780ac59b55aad42fe07"
  integrity sha512-qW1Mfv8taImTthu4KoXgDfLuk4bydU6Q/TkADnDWWHwi4NX4BR+LWfTp2sVmTqRrsHvyDDTelgelxJ+SsejKKQ==
  dependencies:
    "@types/react" "*"

"@types/react@*", "@types/react@^18.3.12":
  version "18.3.12"
  resolved "https://registry.yarnpkg.com/@types/react/-/react-18.3.12.tgz#99419f182ccd69151813b7ee24b792fe08774f60"
  integrity sha512-D2wOSq/d6Agt28q7rSI3jhU7G6aiuzljDGZ2hTZHIkrTLUI+AF3WMeKkEZ9nN2fkBAlcktT6vcZjDFiIhMYEQw==
  dependencies:
    "@types/prop-types" "*"
    csstype "^3.0.2"

"@types/ws@^8.5.10":
  version "8.5.13"
  resolved "https://registry.yarnpkg.com/@types/ws/-/ws-8.5.13.tgz#6414c280875e2691d0d1e080b05addbf5cb91e20"
  integrity sha512-osM/gWBTPKgHV8XkTunnegTRIsvF6owmf5w+JtAfOw472dptdm0dlGv4xCt6GwQRcC2XVOvvRE/0bAoQcL2QkA==
  dependencies:
    "@types/node" "*"

"@typescript-eslint/eslint-plugin@^5.4.2 || ^6.0.0 || ^7.0.0 || ^8.0.0":
  version "8.13.0"
  resolved "https://registry.yarnpkg.com/@typescript-eslint/eslint-plugin/-/eslint-plugin-8.13.0.tgz#650c50b8c795b5d092189f139f6d00535b5b0f3d"
  integrity sha512-nQtBLiZYMUPkclSeC3id+x4uVd1SGtHuElTxL++SfP47jR0zfkZBJHc+gL4qPsgTuypz0k8Y2GheaDYn6Gy3rg==
  dependencies:
    "@eslint-community/regexpp" "^4.10.0"
    "@typescript-eslint/scope-manager" "8.13.0"
    "@typescript-eslint/type-utils" "8.13.0"
    "@typescript-eslint/utils" "8.13.0"
    "@typescript-eslint/visitor-keys" "8.13.0"
    graphemer "^1.4.0"
    ignore "^5.3.1"
    natural-compare "^1.4.0"
    ts-api-utils "^1.3.0"

"@typescript-eslint/parser@^5.4.2 || ^6.0.0 || ^7.0.0 || ^8.0.0":
  version "8.13.0"
  resolved "https://registry.yarnpkg.com/@typescript-eslint/parser/-/parser-8.13.0.tgz#ef76203b7cac515aa3ccc4f7ce5320dd61c46b29"
  integrity sha512-w0xp+xGg8u/nONcGw1UXAr6cjCPU1w0XVyBs6Zqaj5eLmxkKQAByTdV/uGgNN5tVvN/kKpoQlP2cL7R+ajZZIQ==
  dependencies:
    "@typescript-eslint/scope-manager" "8.13.0"
    "@typescript-eslint/types" "8.13.0"
    "@typescript-eslint/typescript-estree" "8.13.0"
    "@typescript-eslint/visitor-keys" "8.13.0"
    debug "^4.3.4"

"@typescript-eslint/scope-manager@8.13.0":
  version "8.13.0"
  resolved "https://registry.yarnpkg.com/@typescript-eslint/scope-manager/-/scope-manager-8.13.0.tgz#2f4aed0b87d72360e64e4ea194b1fde14a59082e"
  integrity sha512-XsGWww0odcUT0gJoBZ1DeulY1+jkaHUciUq4jKNv4cpInbvvrtDoyBH9rE/n2V29wQJPk8iCH1wipra9BhmiMA==
  dependencies:
    "@typescript-eslint/types" "8.13.0"
    "@typescript-eslint/visitor-keys" "8.13.0"

"@typescript-eslint/type-utils@8.13.0":
  version "8.13.0"
  resolved "https://registry.yarnpkg.com/@typescript-eslint/type-utils/-/type-utils-8.13.0.tgz#8c8fa68490dcb9ae1687ffc7de8fbe23c26417bd"
  integrity sha512-Rqnn6xXTR316fP4D2pohZenJnp+NwQ1mo7/JM+J1LWZENSLkJI8ID8QNtlvFeb0HnFSK94D6q0cnMX6SbE5/vA==
  dependencies:
    "@typescript-eslint/typescript-estree" "8.13.0"
    "@typescript-eslint/utils" "8.13.0"
    debug "^4.3.4"
    ts-api-utils "^1.3.0"

"@typescript-eslint/types@8.13.0":
  version "8.13.0"
  resolved "https://registry.yarnpkg.com/@typescript-eslint/types/-/types-8.13.0.tgz#3f35dead2b2491a04339370dcbcd17bbdfc204d8"
  integrity sha512-4cyFErJetFLckcThRUFdReWJjVsPCqyBlJTi6IDEpc1GWCIIZRFxVppjWLIMcQhNGhdWJJRYFHpHoDWvMlDzng==

"@typescript-eslint/typescript-estree@8.13.0":
  version "8.13.0"
  resolved "https://registry.yarnpkg.com/@typescript-eslint/typescript-estree/-/typescript-estree-8.13.0.tgz#db8c93dd5437ca3ce417a255fb35ddc3c12c3e95"
  integrity sha512-v7SCIGmVsRK2Cy/LTLGN22uea6SaUIlpBcO/gnMGT/7zPtxp90bphcGf4fyrCQl3ZtiBKqVTG32hb668oIYy1g==
  dependencies:
    "@typescript-eslint/types" "8.13.0"
    "@typescript-eslint/visitor-keys" "8.13.0"
    debug "^4.3.4"
    fast-glob "^3.3.2"
    is-glob "^4.0.3"
    minimatch "^9.0.4"
    semver "^7.6.0"
    ts-api-utils "^1.3.0"

"@typescript-eslint/utils@8.13.0":
  version "8.13.0"
  resolved "https://registry.yarnpkg.com/@typescript-eslint/utils/-/utils-8.13.0.tgz#f6d40e8b5053dcaeabbd2e26463857abf27d62c0"
  integrity sha512-A1EeYOND6Uv250nybnLZapeXpYMl8tkzYUxqmoKAWnI4sei3ihf2XdZVd+vVOmHGcp3t+P7yRrNsyyiXTvShFQ==
  dependencies:
    "@eslint-community/eslint-utils" "^4.4.0"
    "@typescript-eslint/scope-manager" "8.13.0"
    "@typescript-eslint/types" "8.13.0"
    "@typescript-eslint/typescript-estree" "8.13.0"

"@typescript-eslint/visitor-keys@8.13.0":
  version "8.13.0"
  resolved "https://registry.yarnpkg.com/@typescript-eslint/visitor-keys/-/visitor-keys-8.13.0.tgz#e97b0d92b266ef38a1faf40a74da289b66683a5b"
  integrity sha512-7N/+lztJqH4Mrf0lb10R/CbI1EaAMMGyF5y0oJvFoAhafwgiRA7TXyd8TFn8FC8k5y2dTsYogg238qavRGNnlw==
  dependencies:
    "@typescript-eslint/types" "8.13.0"
    eslint-visitor-keys "^3.4.3"

"@ungap/structured-clone@^1.2.0":
  version "1.2.0"
  resolved "https://registry.yarnpkg.com/@ungap/structured-clone/-/structured-clone-1.2.0.tgz#756641adb587851b5ccb3e095daf27ae581c8406"
  integrity sha512-zuVdFrMJiuCDQUMCzQaD6KL28MjnqqN8XnAqiEq9PNm/hCPTSGfrXCOfwj1ow4LFb/tNymJPwsNbVePc1xFqrQ==

acorn-jsx@^5.3.2:
  version "5.3.2"
  resolved "https://registry.yarnpkg.com/acorn-jsx/-/acorn-jsx-5.3.2.tgz#7ed5bb55908b3b2f1bc55c6af1653bada7f07937"
  integrity sha512-rq9s+JNhf0IChjtDXxllJ7g41oZk5SlXtp0LHwyA5cejwn7vKmKp4pPri6YEePv2PU65sAsegbXtIinmDFDXgQ==

acorn@^8.9.0:
  version "8.14.0"
  resolved "https://registry.yarnpkg.com/acorn/-/acorn-8.14.0.tgz#063e2c70cac5fb4f6467f0b11152e04c682795b0"
  integrity sha512-cl669nCJTZBsL97OF4kUQm5g5hC2uihk0NxY3WENAC0TYdILVkAyHymAntgxGkl7K+t0cXIrH5siy5S4XkFycA==

ajv@^6.12.4:
  version "6.12.6"
  resolved "https://registry.yarnpkg.com/ajv/-/ajv-6.12.6.tgz#baf5a62e802b07d977034586f8c3baf5adf26df4"
  integrity sha512-j3fVLgvTo527anyYyJOGTYJbG+vnnQYvE0m5mmkc1TK+nxAppkCLMIL0aZ4dblVCNoGShhm+kzE4ZUykBoMg4g==
  dependencies:
    fast-deep-equal "^3.1.1"
    fast-json-stable-stringify "^2.0.0"
    json-schema-traverse "^0.4.1"
    uri-js "^4.2.2"

ansi-regex@^5.0.1:
  version "5.0.1"
  resolved "https://registry.yarnpkg.com/ansi-regex/-/ansi-regex-5.0.1.tgz#082cb2c89c9fe8659a311a53bd6a4dc5301db304"
  integrity sha512-quJQXlTSUGL2LH9SUXo8VwsY4soanhgo6LNSm84E1LBcE8s3O0wpdiRzyR9z/ZZJMlMWv37qOOb9pdJlMUEKFQ==

ansi-regex@^6.0.1:
  version "6.1.0"
  resolved "https://registry.yarnpkg.com/ansi-regex/-/ansi-regex-6.1.0.tgz#95ec409c69619d6cb1b8b34f14b660ef28ebd654"
  integrity sha512-7HSX4QQb4CspciLpVFwyRe79O3xsIZDDLER21kERQ71oaPodF8jL725AgJMFAYbooIqolJoRLuM81SpeUkpkvA==

ansi-styles@^4.0.0, ansi-styles@^4.1.0:
  version "4.3.0"
  resolved "https://registry.yarnpkg.com/ansi-styles/-/ansi-styles-4.3.0.tgz#edd803628ae71c04c85ae7a0906edad34b648937"
  integrity sha512-zbB9rCJAT1rbjiVDb2hqKFHNYLxgtk8NURxZ3IZwD3F6NtxbXZQCnnSi1Lkx+IDohdPlFp222wVALIheZJQSEg==
  dependencies:
    color-convert "^2.0.1"

ansi-styles@^6.1.0:
  version "6.2.1"
  resolved "https://registry.yarnpkg.com/ansi-styles/-/ansi-styles-6.2.1.tgz#0e62320cf99c21afff3b3012192546aacbfb05c5"
  integrity sha512-bN798gFfQX+viw3R7yrGWRqnrN2oRkEkUjjl4JNn4E8GxxbjtG3FbrEIIY3l8/hrwUwIeCZvi4QuOTP4MErVug==

any-promise@^1.0.0:
  version "1.3.0"
  resolved "https://registry.yarnpkg.com/any-promise/-/any-promise-1.3.0.tgz#abc6afeedcea52e809cdc0376aed3ce39635d17f"
  integrity sha512-7UvmKalWRt1wgjL1RrGxoSJW/0QZFIegpeGvZG9kjp8vrRu55XTHbwnqq2GpXm9uLbcuhxm3IqX9OB4MZR1b2A==

anymatch@~3.1.2:
  version "3.1.3"
  resolved "https://registry.yarnpkg.com/anymatch/-/anymatch-3.1.3.tgz#790c58b19ba1720a84205b57c618d5ad8524973e"
  integrity sha512-KMReFUr0B4t+D+OBkjR3KYqvocp2XaSzO55UcB6mgQMd3KbcE+mWTyvVV7D/zsdEbNnV6acZUutkiHQXvTr1Rw==
  dependencies:
    normalize-path "^3.0.0"
    picomatch "^2.0.4"

arg@^5.0.2:
  version "5.0.2"
  resolved "https://registry.yarnpkg.com/arg/-/arg-5.0.2.tgz#c81433cc427c92c4dcf4865142dbca6f15acd59c"
  integrity sha512-PYjyFOLKQ9y57JvQ6QLo8dAgNqswh8M1RMJYdQduT6xbWSgK36P/Z/v+p888pM69jMMfS8Xd8F6I1kQ/I9HUGg==

argparse@^2.0.1:
  version "2.0.1"
  resolved "https://registry.yarnpkg.com/argparse/-/argparse-2.0.1.tgz#246f50f3ca78a3240f6c997e8a9bd1eac49e4b38"
  integrity sha512-8+9WqebbFzpX9OR+Wa6O29asIogeRMzcGtAINdpMHHyAg10f05aSFVBbcEqGf/PXw1EjAZ+q2/bEBg3DvurK3Q==

aria-hidden@^1.1.1:
  version "1.2.4"
  resolved "https://registry.yarnpkg.com/aria-hidden/-/aria-hidden-1.2.4.tgz#b78e383fdbc04d05762c78b4a25a501e736c4522"
  integrity sha512-y+CcFFwelSXpLZk/7fMB2mUbGtX9lKycf1MWJ7CaTIERyitVlyQx6C+sxcROU2BAJ24OiZyK+8wj2i8AlBoS3A==
  dependencies:
    tslib "^2.0.0"

aria-query@^5.3.2:
  version "5.3.2"
  resolved "https://registry.yarnpkg.com/aria-query/-/aria-query-5.3.2.tgz#93f81a43480e33a338f19163a3d10a50c01dcd59"
  integrity sha512-COROpnaoap1E2F000S62r6A60uHZnmlvomhfyT2DlTcrY1OrBKn2UhH7qn5wTC9zMvD0AY7csdPSNwKP+7WiQw==

array-buffer-byte-length@^1.0.1:
  version "1.0.1"
  resolved "https://registry.yarnpkg.com/array-buffer-byte-length/-/array-buffer-byte-length-1.0.1.tgz#1e5583ec16763540a27ae52eed99ff899223568f"
  integrity sha512-ahC5W1xgou+KTXix4sAO8Ki12Q+jf4i0+tmk3sC+zgcynshkHxzpXdImBehiUYKKKDwvfFiJl1tZt6ewscS1Mg==
  dependencies:
    call-bind "^1.0.5"
    is-array-buffer "^3.0.4"

array-includes@^3.1.6, array-includes@^3.1.8:
  version "3.1.8"
  resolved "https://registry.yarnpkg.com/array-includes/-/array-includes-3.1.8.tgz#5e370cbe172fdd5dd6530c1d4aadda25281ba97d"
  integrity sha512-itaWrbYbqpGXkGhZPGUulwnhVf5Hpy1xiCFsGqyIGglbBxmG5vSjxQen3/WGOjPpNEv1RtBLKxbmVXm8HpJStQ==
  dependencies:
    call-bind "^1.0.7"
    define-properties "^1.2.1"
    es-abstract "^1.23.2"
    es-object-atoms "^1.0.0"
    get-intrinsic "^1.2.4"
    is-string "^1.0.7"

array.prototype.findlast@^1.2.5:
  version "1.2.5"
  resolved "https://registry.yarnpkg.com/array.prototype.findlast/-/array.prototype.findlast-1.2.5.tgz#3e4fbcb30a15a7f5bf64cf2faae22d139c2e4904"
  integrity sha512-CVvd6FHg1Z3POpBLxO6E6zr+rSKEQ9L6rZHAaY7lLfhKsWYUBBOuMs0e9o24oopj6H+geRCX0YJ+TJLBK2eHyQ==
  dependencies:
    call-bind "^1.0.7"
    define-properties "^1.2.1"
    es-abstract "^1.23.2"
    es-errors "^1.3.0"
    es-object-atoms "^1.0.0"
    es-shim-unscopables "^1.0.2"

array.prototype.findlastindex@^1.2.5:
  version "1.2.5"
  resolved "https://registry.yarnpkg.com/array.prototype.findlastindex/-/array.prototype.findlastindex-1.2.5.tgz#8c35a755c72908719453f87145ca011e39334d0d"
  integrity sha512-zfETvRFA8o7EiNn++N5f/kaCw221hrpGsDmcpndVupkPzEc1Wuf3VgC0qby1BbHs7f5DVYjgtEU2LLh5bqeGfQ==
  dependencies:
    call-bind "^1.0.7"
    define-properties "^1.2.1"
    es-abstract "^1.23.2"
    es-errors "^1.3.0"
    es-object-atoms "^1.0.0"
    es-shim-unscopables "^1.0.2"

array.prototype.flat@^1.3.1, array.prototype.flat@^1.3.2:
  version "1.3.2"
  resolved "https://registry.yarnpkg.com/array.prototype.flat/-/array.prototype.flat-1.3.2.tgz#1476217df8cff17d72ee8f3ba06738db5b387d18"
  integrity sha512-djYB+Zx2vLewY8RWlNCUdHjDXs2XOgm602S9E7P/UpHgfeHL00cRiIF+IN/G/aUJ7kGPb6yO/ErDI5V2s8iycA==
  dependencies:
    call-bind "^1.0.2"
    define-properties "^1.2.0"
    es-abstract "^1.22.1"
    es-shim-unscopables "^1.0.0"

array.prototype.flatmap@^1.3.2:
  version "1.3.2"
  resolved "https://registry.yarnpkg.com/array.prototype.flatmap/-/array.prototype.flatmap-1.3.2.tgz#c9a7c6831db8e719d6ce639190146c24bbd3e527"
  integrity sha512-Ewyx0c9PmpcsByhSW4r+9zDU7sGjFc86qf/kKtuSCRdhfbk0SNLLkaT5qvcHnRGgc5NP/ly/y+qkXkqONX54CQ==
  dependencies:
    call-bind "^1.0.2"
    define-properties "^1.2.0"
    es-abstract "^1.22.1"
    es-shim-unscopables "^1.0.0"

array.prototype.tosorted@^1.1.4:
  version "1.1.4"
  resolved "https://registry.yarnpkg.com/array.prototype.tosorted/-/array.prototype.tosorted-1.1.4.tgz#fe954678ff53034e717ea3352a03f0b0b86f7ffc"
  integrity sha512-p6Fx8B7b7ZhL/gmUsAy0D15WhvDccw3mnGNbZpi3pmeJdxtWsj2jEaI4Y6oo3XiHfzuSgPwKc04MYt6KgvC/wA==
  dependencies:
    call-bind "^1.0.7"
    define-properties "^1.2.1"
    es-abstract "^1.23.3"
    es-errors "^1.3.0"
    es-shim-unscopables "^1.0.2"

arraybuffer.prototype.slice@^1.0.3:
  version "1.0.3"
  resolved "https://registry.yarnpkg.com/arraybuffer.prototype.slice/-/arraybuffer.prototype.slice-1.0.3.tgz#097972f4255e41bc3425e37dc3f6421cf9aefde6"
  integrity sha512-bMxMKAjg13EBSVscxTaYA4mRc5t1UAXa2kXiGTNfZ079HIWXEkKmkgFrh/nJqamaLSrXO5H4WFFkPEaLJWbs3A==
  dependencies:
    array-buffer-byte-length "^1.0.1"
    call-bind "^1.0.5"
    define-properties "^1.2.1"
    es-abstract "^1.22.3"
    es-errors "^1.2.1"
    get-intrinsic "^1.2.3"
    is-array-buffer "^3.0.4"
    is-shared-array-buffer "^1.0.2"

ast-types-flow@^0.0.8:
  version "0.0.8"
  resolved "https://registry.yarnpkg.com/ast-types-flow/-/ast-types-flow-0.0.8.tgz#0a85e1c92695769ac13a428bb653e7538bea27d6"
  integrity sha512-OH/2E5Fg20h2aPrbe+QL8JZQFko0YZaF+j4mnQ7BGhfavO7OpSLa8a0y9sBwomHdSbkhTS8TQNayBfnW5DwbvQ==

autoprefixer@^10.4.20:
  version "10.4.20"
  resolved "https://registry.yarnpkg.com/autoprefixer/-/autoprefixer-10.4.20.tgz#5caec14d43976ef42e32dcb4bd62878e96be5b3b"
  integrity sha512-XY25y5xSv/wEoqzDyXXME4AFfkZI0P23z6Fs3YgymDnKJkCGOnkL0iTxCa85UTqaSgfcqyf3UA6+c7wUvx/16g==
  dependencies:
    browserslist "^4.23.3"
    caniuse-lite "^1.0.30001646"
    fraction.js "^4.3.7"
    normalize-range "^0.1.2"
    picocolors "^1.0.1"
    postcss-value-parser "^4.2.0"

available-typed-arrays@^1.0.7:
  version "1.0.7"
  resolved "https://registry.yarnpkg.com/available-typed-arrays/-/available-typed-arrays-1.0.7.tgz#a5cc375d6a03c2efc87a553f3e0b1522def14846"
  integrity sha512-wvUjBtSGN7+7SjNpq/9M2Tg350UZD3q62IFZLbRAR1bSMlCo1ZaeW+BJ+D090e4hIIZLBcTDWe4Mh4jvUDajzQ==
  dependencies:
    possible-typed-array-names "^1.0.0"

axe-core@^4.10.0:
  version "4.10.2"
  resolved "https://registry.yarnpkg.com/axe-core/-/axe-core-4.10.2.tgz#85228e3e1d8b8532a27659b332e39b7fa0e022df"
  integrity sha512-RE3mdQ7P3FRSe7eqCWoeQ/Z9QXrtniSjp1wUjt5nRC3WIpz5rSCve6o3fsZ2aCpJtrZjSZgjwXAoTO5k4tEI0w==

axobject-query@^4.1.0:
  version "4.1.0"
  resolved "https://registry.yarnpkg.com/axobject-query/-/axobject-query-4.1.0.tgz#28768c76d0e3cff21bc62a9e2d0b6ac30042a1ee"
  integrity sha512-qIj0G9wZbMGNLjLmg1PT6v2mE9AH2zlnADJD/2tC6E00hgmhUOfEB6greHPAfLRSufHqROIUTkw6E+M3lH0PTQ==

balanced-match@^1.0.0:
  version "1.0.2"
  resolved "https://registry.yarnpkg.com/balanced-match/-/balanced-match-1.0.2.tgz#e83e3a7e3f300b34cb9d87f615fa0cbf357690ee"
  integrity sha512-3oSeUO0TMV67hN1AmbXsK4yaqU7tjiHlbxRDZOpH0KW9+CeX4bRAaX0Anxt0tx2MrpRpWwQaPwIlISEJhYU5Pw==

base64-js@^1.3.1:
  version "1.5.1"
  resolved "https://registry.yarnpkg.com/base64-js/-/base64-js-1.5.1.tgz#1b1b440160a5bf7ad40b650f095963481903930a"
  integrity sha512-AKpaYlHn8t4SVbOHCy+b5+KKgvR4vrsD8vbvrbiQJps7fKDTkjkDry6ji0rUJjC0kzbNePLwzxq8iypo41qeWA==

binary-extensions@^2.0.0:
  version "2.3.0"
  resolved "https://registry.yarnpkg.com/binary-extensions/-/binary-extensions-2.3.0.tgz#f6e14a97858d327252200242d4ccfe522c445522"
  integrity sha512-Ceh+7ox5qe7LJuLHoY0feh3pHuUDHAcRUeyL2VYghZwfpkNIy/+8Ocg0a3UuSoYzavmylwuLWQOf3hl0jjMMIw==

bl@^5.0.0:
  version "5.1.0"
  resolved "https://registry.yarnpkg.com/bl/-/bl-5.1.0.tgz#183715f678c7188ecef9fe475d90209400624273"
  integrity sha512-tv1ZJHLfTDnXE6tMHv73YgSJaWR2AFuPwMntBe7XL/GBFHnT0CLnsHMogfk5+GzCDC5ZWarSCYaIGATZt9dNsQ==
  dependencies:
    buffer "^6.0.3"
    inherits "^2.0.4"
    readable-stream "^3.4.0"

brace-expansion@^1.1.7:
  version "1.1.11"
  resolved "https://registry.yarnpkg.com/brace-expansion/-/brace-expansion-1.1.11.tgz#3c7fcbf529d87226f3d2f52b966ff5271eb441dd"
  integrity sha512-iCuPHDFgrHX7H2vEI/5xpz07zSHB00TpugqhmYtVmMO6518mCuRMoOYFldEBl0g187ufozdaHgWKcYFb61qGiA==
  dependencies:
    balanced-match "^1.0.0"
    concat-map "0.0.1"

brace-expansion@^2.0.1:
  version "2.0.1"
  resolved "https://registry.yarnpkg.com/brace-expansion/-/brace-expansion-2.0.1.tgz#1edc459e0f0c548486ecf9fc99f2221364b9a0ae"
  integrity sha512-XnAIvQ8eM+kC6aULx6wuQiwVsnzsi9d3WxzV3FpWTGA19F621kwdbsAcFKXgKUHZWsy+mY6iL1sHTxWEFCytDA==
  dependencies:
    balanced-match "^1.0.0"

braces@^3.0.3, braces@~3.0.2:
  version "3.0.3"
  resolved "https://registry.yarnpkg.com/braces/-/braces-3.0.3.tgz#490332f40919452272d55a8480adc0c441358789"
  integrity sha512-yQbXgO/OSZVD2IsiLlro+7Hf6Q18EJrKSEsdoMzKePKXct3gvD8oLcOQdIzGupr5Fj+EDe8gO/lxc1BzfMpxvA==
  dependencies:
    fill-range "^7.1.1"

browserslist@^4.23.3:
  version "4.24.2"
  resolved "https://registry.yarnpkg.com/browserslist/-/browserslist-4.24.2.tgz#f5845bc91069dbd55ee89faf9822e1d885d16580"
  integrity sha512-ZIc+Q62revdMcqC6aChtW4jz3My3klmCO1fEmINZY/8J3EpBg5/A/D0AKmBveUh6pgoeycoMkVMko84tuYS+Gg==
  dependencies:
    caniuse-lite "^1.0.30001669"
    electron-to-chromium "^1.5.41"
    node-releases "^2.0.18"
    update-browserslist-db "^1.1.1"

buffer@^6.0.3:
  version "6.0.3"
  resolved "https://registry.yarnpkg.com/buffer/-/buffer-6.0.3.tgz#2ace578459cc8fbe2a70aaa8f52ee63b6a74c6c6"
  integrity sha512-FTiCpNxtwiZZHEZbcbTIcZjERVICn9yq/pDFkTl95/AxzD1naBctN7YO68riM/gLSDY7sdrMby8hofADYuuqOA==
  dependencies:
    base64-js "^1.3.1"
    ieee754 "^1.2.1"

busboy@1.6.0:
  version "1.6.0"
  resolved "https://registry.yarnpkg.com/busboy/-/busboy-1.6.0.tgz#966ea36a9502e43cdb9146962523b92f531f6893"
  integrity sha512-8SFQbg/0hQ9xy3UNTB0YEnsNBbWfhf7RtnzpL7TkBiTBRfrQ9Fxcnz7VJsleJpyp6rVLvXiuORqjlHi5q+PYuA==
  dependencies:
    streamsearch "^1.1.0"

call-bind@^1.0.2, call-bind@^1.0.5, call-bind@^1.0.6, call-bind@^1.0.7:
  version "1.0.7"
  resolved "https://registry.yarnpkg.com/call-bind/-/call-bind-1.0.7.tgz#06016599c40c56498c18769d2730be242b6fa3b9"
  integrity sha512-GHTSNSYICQ7scH7sZ+M2rFopRoLh8t2bLSW6BbgrtLsahOIB5iyAVJf9GjWK3cYTDaMj4XdBpM1cA6pIS0Kv2w==
  dependencies:
    es-define-property "^1.0.0"
    es-errors "^1.3.0"
    function-bind "^1.1.2"
    get-intrinsic "^1.2.4"
    set-function-length "^1.2.1"

callsites@^3.0.0:
  version "3.1.0"
  resolved "https://registry.yarnpkg.com/callsites/-/callsites-3.1.0.tgz#b3630abd8943432f54b3f0519238e33cd7df2f73"
  integrity sha512-P8BjAsXvZS+VIDUI11hHCQEv74YT67YUi5JJFNWIqL235sBmjX4+qx9Muvls5ivyNENctx46xQLQ3aTuE7ssaQ==

camelcase-css@^2.0.1:
  version "2.0.1"
  resolved "https://registry.yarnpkg.com/camelcase-css/-/camelcase-css-2.0.1.tgz#ee978f6947914cc30c6b44741b6ed1df7f043fd5"
  integrity sha512-QOSvevhslijgYwRx6Rv7zKdMF8lbRmx+uQGx2+vDc+KI/eBnsy9kit5aj23AgGu3pa4t9AgwbnXWqS+iOY+2aA==

caniuse-lite@^1.0.30001579, caniuse-lite@^1.0.30001646, caniuse-lite@^1.0.30001669:
  version "1.0.30001678"
  resolved "https://registry.yarnpkg.com/caniuse-lite/-/caniuse-lite-1.0.30001678.tgz#b930b04cd0b295136405634aa32ad540d7eeb71e"
  integrity sha512-RR+4U/05gNtps58PEBDZcPWTgEO2MBeoPZ96aQcjmfkBWRIDfN451fW2qyDA9/+HohLLIL5GqiMwA+IB1pWarw==

chalk@5.2.0:
  version "5.2.0"
  resolved "https://registry.yarnpkg.com/chalk/-/chalk-5.2.0.tgz#249623b7d66869c673699fb66d65723e54dfcfb3"
  integrity sha512-ree3Gqw/nazQAPuJJEy+avdl7QfZMcUvmHIKgEZkGL+xOBzRvup5Hxo6LHuMceSxOabuJLJm5Yp/92R9eMmMvA==

chalk@^4.0.0:
  version "4.1.2"
  resolved "https://registry.yarnpkg.com/chalk/-/chalk-4.1.2.tgz#aac4e2b7734a740867aeb16bf02aad556a1e7a01"
  integrity sha512-oKnbhFyRIXpUuez8iBMmyEa4nbj4IOQyuhc/wy9kY7/WVPcwIO9VA668Pu8RkO7+0G76SLROeyw9CpQ061i4mA==
  dependencies:
    ansi-styles "^4.1.0"
    supports-color "^7.1.0"

chalk@^5.0.0:
  version "5.3.0"
  resolved "https://registry.yarnpkg.com/chalk/-/chalk-5.3.0.tgz#67c20a7ebef70e7f3970a01f90fa210cb6860385"
  integrity sha512-dLitG79d+GV1Nb/VYcCDFivJeK1hiukt9QjRNVOsUtTy1rR1YJsmpGGTZ3qJos+uw7WmWF4wUwBd9jxjocFC2w==

chokidar@^3.5.3:
  version "3.6.0"
  resolved "https://registry.yarnpkg.com/chokidar/-/chokidar-3.6.0.tgz#197c6cc669ef2a8dc5e7b4d97ee4e092c3eb0d5b"
  integrity sha512-7VT13fmjotKpGipCW9JEQAusEPE+Ei8nl6/g4FBAmIm0GOOLMua9NDDo/DWp0ZAxCr3cPq5ZpBqmPAQgDda2Pw==
  dependencies:
    anymatch "~3.1.2"
    braces "~3.0.2"
    glob-parent "~5.1.2"
    is-binary-path "~2.1.0"
    is-glob "~4.0.1"
    normalize-path "~3.0.0"
    readdirp "~3.6.0"
  optionalDependencies:
    fsevents "~2.3.2"

class-variance-authority@^0.7.0:
  version "0.7.0"
  resolved "https://registry.yarnpkg.com/class-variance-authority/-/class-variance-authority-0.7.0.tgz#1c3134d634d80271b1837452b06d821915954522"
  integrity sha512-jFI8IQw4hczaL4ALINxqLEXQbWcNjoSkloa4IaufXCJr6QawJyw7tuRysRsrE8w2p/4gGaxKIt/hX3qz/IbD1A==
  dependencies:
    clsx "2.0.0"

cli-cursor@^4.0.0:
  version "4.0.0"
  resolved "https://registry.yarnpkg.com/cli-cursor/-/cli-cursor-4.0.0.tgz#3cecfe3734bf4fe02a8361cbdc0f6fe28c6a57ea"
  integrity sha512-VGtlMu3x/4DOtIUwEkRezxUZ2lBacNJCHash0N0WeZDBS+7Ux1dm3XWAgWYxLJFMMdOeXMHXorshEFhbMSGelg==
  dependencies:
    restore-cursor "^4.0.0"

cli-spinners@^2.6.1:
  version "2.9.2"
  resolved "https://registry.yarnpkg.com/cli-spinners/-/cli-spinners-2.9.2.tgz#1773a8f4b9c4d6ac31563df53b3fc1d79462fe41"
  integrity sha512-ywqV+5MmyL4E7ybXgKys4DugZbX0FC6LnwrhjuykIjnK9k8OQacQ7axGKnjDXWNhns0xot3bZI5h55H8yo9cJg==

client-only@0.0.1:
  version "0.0.1"
  resolved "https://registry.yarnpkg.com/client-only/-/client-only-0.0.1.tgz#38bba5d403c41ab150bff64a95c85013cf73bca1"
  integrity sha512-IV3Ou0jSMzZrd3pZ48nLkT9DA7Ag1pnPzaiQhpW7c3RbcqqzvzzVu+L8gfqMp/8IM2MQtSiqaCxrrcfu8I8rMA==

clone@^1.0.2:
  version "1.0.4"
  resolved "https://registry.yarnpkg.com/clone/-/clone-1.0.4.tgz#da309cc263df15994c688ca902179ca3c7cd7c7e"
  integrity sha512-JQHZ2QMW6l3aH/j6xCqQThY/9OH4D/9ls34cgkUBiEeocRTU04tHfKPBsUK1PqZCUQM7GiA0IIXJSuXHI64Kbg==

clsx@2.0.0:
  version "2.0.0"
  resolved "https://registry.yarnpkg.com/clsx/-/clsx-2.0.0.tgz#12658f3fd98fafe62075595a5c30e43d18f3d00b"
  integrity sha512-rQ1+kcj+ttHG0MKVGBUXwayCCF1oh39BF5COIpRzuCEv8Mwjv0XucrI2ExNTOn9IlLifGClWQcU9BrZORvtw6Q==

clsx@^2.1.1:
  version "2.1.1"
  resolved "https://registry.yarnpkg.com/clsx/-/clsx-2.1.1.tgz#eed397c9fd8bd882bfb18deab7102049a2f32999"
  integrity sha512-eYm0QWBtUrBWZWG0d386OGAw16Z995PiOVo2B7bjWSbHedGl5e0ZWaq65kOGgUSNesEIDkB9ISbTg/JK9dhCZA==

color-convert@^2.0.1:
  version "2.0.1"
  resolved "https://registry.yarnpkg.com/color-convert/-/color-convert-2.0.1.tgz#72d3a68d598c9bdb3af2ad1e84f21d896abd4de3"
  integrity sha512-RRECPsj7iu/xb5oKYcsFHSppFNnsj/52OVTRKb4zP5onXwVF3zVmmToNcOfGC+CRDpfK/U584fMg38ZHCaElKQ==
  dependencies:
    color-name "~1.1.4"

color-name@^1.0.0, color-name@~1.1.4:
  version "1.1.4"
  resolved "https://registry.yarnpkg.com/color-name/-/color-name-1.1.4.tgz#c2a09a87acbde69543de6f63fa3995c826c536a2"
  integrity sha512-dOy+3AuW3a2wNbZHIuMZpTcgjGuLU/uBL/ubcZF9OXbDo8ff4O8yVp5Bf0efS8uEoYo5q4Fx7dY9OgQGXgAsQA==

color-string@^1.9.0:
  version "1.9.1"
  resolved "https://registry.yarnpkg.com/color-string/-/color-string-1.9.1.tgz#4467f9146f036f855b764dfb5bf8582bf342c7a4"
  integrity sha512-shrVawQFojnZv6xM40anx4CkoDP+fZsw/ZerEMsW/pyzsRbElpsL/DBVW7q3ExxwusdNXI3lXpuhEZkzs8p5Eg==
  dependencies:
    color-name "^1.0.0"
    simple-swizzle "^0.2.2"

color@^4.2.3:
  version "4.2.3"
  resolved "https://registry.yarnpkg.com/color/-/color-4.2.3.tgz#d781ecb5e57224ee43ea9627560107c0e0c6463a"
  integrity sha512-1rXeuUUiGGrykh+CeBdu5Ie7OJwinCgQY0bc7GCRxy5xVHy+moaqkpL/jqQq0MtQOeYcrqEz4abc5f0KtU7W4A==
  dependencies:
    color-convert "^2.0.1"
    color-string "^1.9.0"

commander@^10.0.0:
  version "10.0.1"
  resolved "https://registry.yarnpkg.com/commander/-/commander-10.0.1.tgz#881ee46b4f77d1c1dccc5823433aa39b022cbe06"
  integrity sha512-y4Mg2tXshplEbSGzx7amzPwKKOCGuoSRP/CjEdwwk0FOGlUbq6lKuoyDZTNZkmxHdJtp54hdfY/JUrdL7Xfdug==

commander@^4.0.0:
  version "4.1.1"
  resolved "https://registry.yarnpkg.com/commander/-/commander-4.1.1.tgz#9fd602bd936294e9e9ef46a3f4d6964044b18068"
  integrity sha512-NOKm8xhkzAjzFx8B2v5OAHT+u5pRQc2UCa2Vq9jYL/31o2wi9mxBA7LIFs3sV5VSC49z6pEhfbMULvShKj26WA==

concat-map@0.0.1:
  version "0.0.1"
  resolved "https://registry.yarnpkg.com/concat-map/-/concat-map-0.0.1.tgz#d8a96bd77fd68df7793a73036a3ba0d5405d477b"
  integrity sha512-/Srv4dswyQNBfohGpz9o6Yb3Gz3SrUDqBH5rTuhGR7ahtlbYKnVxw2bCFMRljaA7EXHaXZ8wsHdodFvbkhKmqg==

cross-spawn@^7.0.0, cross-spawn@^7.0.2, cross-spawn@^7.0.3:
  version "7.0.5"
  resolved "https://registry.yarnpkg.com/cross-spawn/-/cross-spawn-7.0.5.tgz#910aac880ff5243da96b728bc6521a5f6c2f2f82"
  integrity sha512-ZVJrKKYunU38/76t0RMOulHOnUcbU9GbpWKAOZ0mhjr7CX6FVrH+4FrAapSOekrgFQ3f/8gwMEuIft0aKq6Hug==
  dependencies:
    path-key "^3.1.0"
    shebang-command "^2.0.0"
    which "^2.0.1"

cssesc@^3.0.0:
  version "3.0.0"
  resolved "https://registry.yarnpkg.com/cssesc/-/cssesc-3.0.0.tgz#37741919903b868565e1c09ea747445cd18983ee"
  integrity sha512-/Tb/JcjK111nNScGob5MNtsntNM1aCNUDipB/TkwZFhyDrrE47SOx/18wF2bbjgc3ZzCSKW1T5nt5EbFoAz/Vg==

csstype@^3.0.2:
  version "3.1.3"
  resolved "https://registry.yarnpkg.com/csstype/-/csstype-3.1.3.tgz#d80ff294d114fb0e6ac500fbf85b60137d7eff81"
  integrity sha512-M1uQkMl8rQK/szD0LNhtqxIPLpimGm8sOBwU7lLnCpSbTyY3yeU1Vc7l4KT5zT4s/yOxHH5O7tIuuLOCnLADRw==

damerau-levenshtein@^1.0.8:
  version "1.0.8"
  resolved "https://registry.yarnpkg.com/damerau-levenshtein/-/damerau-levenshtein-1.0.8.tgz#b43d286ccbd36bc5b2f7ed41caf2d0aba1f8a6e7"
  integrity sha512-sdQSFB7+llfUcQHUQO3+B8ERRj0Oa4w9POWMI/puGtuf7gFywGmkaLCElnudfTiKZV+NvHqL0ifzdrI8Ro7ESA==

data-uri-to-buffer@^4.0.0:
  version "4.0.1"
  resolved "https://registry.yarnpkg.com/data-uri-to-buffer/-/data-uri-to-buffer-4.0.1.tgz#d8feb2b2881e6a4f58c2e08acfd0e2834e26222e"
  integrity sha512-0R9ikRb668HB7QDxT1vkpuUBtqc53YyAwMwGeUFKRojY/NWKvdZ+9UYtRfGmhqNbRkTSVpMbmyhXipFFv2cb/A==

data-view-buffer@^1.0.1:
  version "1.0.1"
  resolved "https://registry.yarnpkg.com/data-view-buffer/-/data-view-buffer-1.0.1.tgz#8ea6326efec17a2e42620696e671d7d5a8bc66b2"
  integrity sha512-0lht7OugA5x3iJLOWFhWK/5ehONdprk0ISXqVFn/NFrDu+cuc8iADFrGQz5BnRK7LLU3JmkbXSxaqX+/mXYtUA==
  dependencies:
    call-bind "^1.0.6"
    es-errors "^1.3.0"
    is-data-view "^1.0.1"

data-view-byte-length@^1.0.1:
  version "1.0.1"
  resolved "https://registry.yarnpkg.com/data-view-byte-length/-/data-view-byte-length-1.0.1.tgz#90721ca95ff280677eb793749fce1011347669e2"
  integrity sha512-4J7wRJD3ABAzr8wP+OcIcqq2dlUKp4DVflx++hs5h5ZKydWMI6/D/fAot+yh6g2tHh8fLFTvNOaVN357NvSrOQ==
  dependencies:
    call-bind "^1.0.7"
    es-errors "^1.3.0"
    is-data-view "^1.0.1"

data-view-byte-offset@^1.0.0:
  version "1.0.0"
  resolved "https://registry.yarnpkg.com/data-view-byte-offset/-/data-view-byte-offset-1.0.0.tgz#5e0bbfb4828ed2d1b9b400cd8a7d119bca0ff18a"
  integrity sha512-t/Ygsytq+R995EJ5PZlD4Cu56sWa8InXySaViRzw9apusqsOO2bQP+SbYzAhR0pFKoB+43lYy8rWban9JSuXnA==
  dependencies:
    call-bind "^1.0.6"
    es-errors "^1.3.0"
    is-data-view "^1.0.1"

debug@^3.2.7:
  version "3.2.7"
  resolved "https://registry.yarnpkg.com/debug/-/debug-3.2.7.tgz#72580b7e9145fb39b6676f9c5e5fb100b934179a"
  integrity sha512-CFjzYYAi4ThfiQvizrFQevTTXHtnCqWfe7x1AhgEscTz6ZbLbfoLRLPugTQyBth6f8ZERVUSyWHFD/7Wu4t1XQ==
  dependencies:
    ms "^2.1.1"

debug@^4.3.1, debug@^4.3.2, debug@^4.3.4, debug@^4.3.5:
  version "4.3.7"
  resolved "https://registry.yarnpkg.com/debug/-/debug-4.3.7.tgz#87945b4151a011d76d95a198d7111c865c360a52"
  integrity sha512-Er2nc/H7RrMXZBFCEim6TCmMk02Z8vLC2Rbi1KEBggpo0fS6l0S1nnapwmIi3yW/+GOJap1Krg4w0Hg80oCqgQ==
  dependencies:
    ms "^2.1.3"

deep-is@^0.1.3:
  version "0.1.4"
  resolved "https://registry.yarnpkg.com/deep-is/-/deep-is-0.1.4.tgz#a6f2dce612fadd2ef1f519b73551f17e85199831"
  integrity sha512-oIPzksmTg4/MriiaYGO+okXDT7ztn/w3Eptv/+gSIdMdKsJo0u4CfYNFJPy+4SKMuCqGw2wxnA+URMg3t8a/bQ==

defaults@^1.0.3:
  version "1.0.4"
  resolved "https://registry.yarnpkg.com/defaults/-/defaults-1.0.4.tgz#b0b02062c1e2aa62ff5d9528f0f98baa90978d7a"
  integrity sha512-eFuaLoy/Rxalv2kr+lqMlUnrDWV+3j4pljOIJgLIhI058IQfWJ7vXhyEIHu+HtC738klGALYxOKDO0bQP3tg8A==
  dependencies:
    clone "^1.0.2"

define-data-property@^1.0.1, define-data-property@^1.1.4:
  version "1.1.4"
  resolved "https://registry.yarnpkg.com/define-data-property/-/define-data-property-1.1.4.tgz#894dc141bb7d3060ae4366f6a0107e68fbe48c5e"
  integrity sha512-rBMvIzlpA8v6E+SJZoo++HAYqsLrkg7MSfIinMPFhmkorw7X+dOXVJQs+QT69zGkzMyfDnIMN2Wid1+NbL3T+A==
  dependencies:
    es-define-property "^1.0.0"
    es-errors "^1.3.0"
    gopd "^1.0.1"

define-properties@^1.1.3, define-properties@^1.2.0, define-properties@^1.2.1:
  version "1.2.1"
  resolved "https://registry.yarnpkg.com/define-properties/-/define-properties-1.2.1.tgz#10781cc616eb951a80a034bafcaa7377f6af2b6c"
  integrity sha512-8QmQKqEASLd5nx0U1B1okLElbUuuttJ/AnYmRXbbbGDWh6uS208EjD4Xqq/I9wK7u0v6O08XhTWnt5XtEbR6Dg==
  dependencies:
    define-data-property "^1.0.1"
    has-property-descriptors "^1.0.0"
    object-keys "^1.1.1"

detect-libc@^2.0.3:
  version "2.0.3"
  resolved "https://registry.yarnpkg.com/detect-libc/-/detect-libc-2.0.3.tgz#f0cd503b40f9939b894697d19ad50895e30cf700"
  integrity sha512-bwy0MGW55bG41VqxxypOsdSdGqLwXPI/focwgTYCFMbdUiBAxLg9CFzG08sz2aqzknwiX7Hkl0bQENjg8iLByw==

detect-node-es@^1.1.0:
  version "1.1.0"
  resolved "https://registry.yarnpkg.com/detect-node-es/-/detect-node-es-1.1.0.tgz#163acdf643330caa0b4cd7c21e7ee7755d6fa493"
  integrity sha512-ypdmJU/TbBby2Dxibuv7ZLW3Bs1QEmM7nHjEANfohJLvE0XVujisn1qPJcZxg+qDucsr+bP6fLD1rPS3AhJ7EQ==

didyoumean@^1.2.2:
  version "1.2.2"
  resolved "https://registry.yarnpkg.com/didyoumean/-/didyoumean-1.2.2.tgz#989346ffe9e839b4555ecf5666edea0d3e8ad037"
  integrity sha512-gxtyfqMg7GKyhQmb056K7M3xszy/myH8w+B4RT+QXBQsvAOdc3XymqDDPHx1BgPgsdAA5SIifona89YtRATDzw==

dlv@^1.1.3:
  version "1.1.3"
  resolved "https://registry.yarnpkg.com/dlv/-/dlv-1.1.3.tgz#5c198a8a11453596e751494d49874bc7732f2e79"
  integrity sha512-+HlytyjlPKnIG8XuRG8WvmBP8xs8P71y+SKKS6ZXWoEgLuePxtDoUEiH7WkdePWrQ5JBpE6aoVqfZfJUQkjXwA==

doctrine@^2.1.0:
  version "2.1.0"
  resolved "https://registry.yarnpkg.com/doctrine/-/doctrine-2.1.0.tgz#5cd01fc101621b42c4cd7f5d1a66243716d3f39d"
  integrity sha512-35mSku4ZXK0vfCuHEDAwt55dg2jNajHZ1odvF+8SSr82EsZY4QmXfuWso8oEd8zRhVObSN18aM0CjSdoBX7zIw==
  dependencies:
    esutils "^2.0.2"

doctrine@^3.0.0:
  version "3.0.0"
  resolved "https://registry.yarnpkg.com/doctrine/-/doctrine-3.0.0.tgz#addebead72a6574db783639dc87a121773973961"
  integrity sha512-yS+Q5i3hBf7GBkd4KG8a7eBNNWNGLTaEwwYWUijIYM7zrlYDM0BFXHjjPWlWZ1Rg7UaddZeIDmi9jF3HmqiQ2w==
  dependencies:
    esutils "^2.0.2"

eastasianwidth@^0.2.0:
  version "0.2.0"
  resolved "https://registry.yarnpkg.com/eastasianwidth/-/eastasianwidth-0.2.0.tgz#696ce2ec0aa0e6ea93a397ffcf24aa7840c827cb"
  integrity sha512-I88TYZWc9XiYHRQ4/3c5rjjfgkjhLyW2luGIheGERbNQ6OY7yTybanSpDXZa8y7VUP9YmDcYa+eyq4ca7iLqWA==

electron-to-chromium@^1.5.41:
  version "1.5.52"
  resolved "https://registry.yarnpkg.com/electron-to-chromium/-/electron-to-chromium-1.5.52.tgz#2bed832c95a56a195504f918150e548474687da8"
  integrity sha512-xtoijJTZ+qeucLBDNztDOuQBE1ksqjvNjvqFoST3nGC7fSpqJ+X6BdTBaY5BHG+IhWWmpc6b/KfpeuEDupEPOQ==

emoji-regex@^8.0.0:
  version "8.0.0"
  resolved "https://registry.yarnpkg.com/emoji-regex/-/emoji-regex-8.0.0.tgz#e818fd69ce5ccfcb404594f842963bf53164cc37"
  integrity sha512-MSjYzcWNOA0ewAHpz0MxpYFvwg6yjy1NG3xteoqz644VCo/RPgnr1/GGt+ic3iJTzQ8Eu3TdM14SawnVUmGE6A==

emoji-regex@^9.2.2:
  version "9.2.2"
  resolved "https://registry.yarnpkg.com/emoji-regex/-/emoji-regex-9.2.2.tgz#840c8803b0d8047f4ff0cf963176b32d4ef3ed72"
  integrity sha512-L18DaJsXSUk2+42pv8mLs5jJT2hqFkFE4j21wOmgbUqsZ2hL72NsUU785g9RXgo3s0ZNgVl42TiHp3ZtOv/Vyg==

enhanced-resolve@^5.15.0:
  version "5.17.1"
  resolved "https://registry.yarnpkg.com/enhanced-resolve/-/enhanced-resolve-5.17.1.tgz#67bfbbcc2f81d511be77d686a90267ef7f898a15"
  integrity sha512-LMHl3dXhTcfv8gM4kEzIUeTQ+7fpdA0l2tUf34BddXPkz2A5xJ5L/Pchd5BL6rdccM9QGvu0sWZzK1Z1t4wwyg==
  dependencies:
    graceful-fs "^4.2.4"
    tapable "^2.2.0"

es-abstract@^1.17.5, es-abstract@^1.22.1, es-abstract@^1.22.3, es-abstract@^1.23.0, es-abstract@^1.23.1, es-abstract@^1.23.2, es-abstract@^1.23.3:
  version "1.23.3"
  resolved "https://registry.yarnpkg.com/es-abstract/-/es-abstract-1.23.3.tgz#8f0c5a35cd215312573c5a27c87dfd6c881a0aa0"
  integrity sha512-e+HfNH61Bj1X9/jLc5v1owaLYuHdeHHSQlkhCBiTK8rBvKaULl/beGMxwrMXjpYrv4pz22BlY570vVePA2ho4A==
  dependencies:
    array-buffer-byte-length "^1.0.1"
    arraybuffer.prototype.slice "^1.0.3"
    available-typed-arrays "^1.0.7"
    call-bind "^1.0.7"
    data-view-buffer "^1.0.1"
    data-view-byte-length "^1.0.1"
    data-view-byte-offset "^1.0.0"
    es-define-property "^1.0.0"
    es-errors "^1.3.0"
    es-object-atoms "^1.0.0"
    es-set-tostringtag "^2.0.3"
    es-to-primitive "^1.2.1"
    function.prototype.name "^1.1.6"
    get-intrinsic "^1.2.4"
    get-symbol-description "^1.0.2"
    globalthis "^1.0.3"
    gopd "^1.0.1"
    has-property-descriptors "^1.0.2"
    has-proto "^1.0.3"
    has-symbols "^1.0.3"
    hasown "^2.0.2"
    internal-slot "^1.0.7"
    is-array-buffer "^3.0.4"
    is-callable "^1.2.7"
    is-data-view "^1.0.1"
    is-negative-zero "^2.0.3"
    is-regex "^1.1.4"
    is-shared-array-buffer "^1.0.3"
    is-string "^1.0.7"
    is-typed-array "^1.1.13"
    is-weakref "^1.0.2"
    object-inspect "^1.13.1"
    object-keys "^1.1.1"
    object.assign "^4.1.5"
    regexp.prototype.flags "^1.5.2"
    safe-array-concat "^1.1.2"
    safe-regex-test "^1.0.3"
    string.prototype.trim "^1.2.9"
    string.prototype.trimend "^1.0.8"
    string.prototype.trimstart "^1.0.8"
    typed-array-buffer "^1.0.2"
    typed-array-byte-length "^1.0.1"
    typed-array-byte-offset "^1.0.2"
    typed-array-length "^1.0.6"
    unbox-primitive "^1.0.2"
    which-typed-array "^1.1.15"

es-define-property@^1.0.0:
  version "1.0.0"
  resolved "https://registry.yarnpkg.com/es-define-property/-/es-define-property-1.0.0.tgz#c7faefbdff8b2696cf5f46921edfb77cc4ba3845"
  integrity sha512-jxayLKShrEqqzJ0eumQbVhTYQM27CfT1T35+gCgDFoL82JLsXqTJ76zv6A0YLOgEnLUMvLzsDsGIrl8NFpT2gQ==
  dependencies:
    get-intrinsic "^1.2.4"

es-errors@^1.2.1, es-errors@^1.3.0:
  version "1.3.0"
  resolved "https://registry.yarnpkg.com/es-errors/-/es-errors-1.3.0.tgz#05f75a25dab98e4fb1dcd5e1472c0546d5057c8f"
  integrity sha512-Zf5H2Kxt2xjTvbJvP2ZWLEICxA6j+hAmMzIlypy4xcBg1vKVnx89Wy0GbS+kf5cwCVFFzdCFh2XSCFNULS6csw==

es-iterator-helpers@^1.1.0:
  version "1.2.0"
  resolved "https://registry.yarnpkg.com/es-iterator-helpers/-/es-iterator-helpers-1.2.0.tgz#2f1a3ab998b30cb2d10b195b587c6d9ebdebf152"
  integrity sha512-tpxqxncxnpw3c93u8n3VOzACmRFoVmWJqbWXvX/JfKbkhBw1oslgPrUfeSt2psuqyEJFD6N/9lg5i7bsKpoq+Q==
  dependencies:
    call-bind "^1.0.7"
    define-properties "^1.2.1"
    es-abstract "^1.23.3"
    es-errors "^1.3.0"
    es-set-tostringtag "^2.0.3"
    function-bind "^1.1.2"
    get-intrinsic "^1.2.4"
    globalthis "^1.0.4"
    gopd "^1.0.1"
    has-property-descriptors "^1.0.2"
    has-proto "^1.0.3"
    has-symbols "^1.0.3"
    internal-slot "^1.0.7"
    iterator.prototype "^1.1.3"
    safe-array-concat "^1.1.2"

es-object-atoms@^1.0.0:
  version "1.0.0"
  resolved "https://registry.yarnpkg.com/es-object-atoms/-/es-object-atoms-1.0.0.tgz#ddb55cd47ac2e240701260bc2a8e31ecb643d941"
  integrity sha512-MZ4iQ6JwHOBQjahnjwaC1ZtIBH+2ohjamzAO3oaHcXYup7qxjF2fixyH+Q71voWHeOkI2q/TnJao/KfXYIZWbw==
  dependencies:
    es-errors "^1.3.0"

es-set-tostringtag@^2.0.3:
  version "2.0.3"
  resolved "https://registry.yarnpkg.com/es-set-tostringtag/-/es-set-tostringtag-2.0.3.tgz#8bb60f0a440c2e4281962428438d58545af39777"
  integrity sha512-3T8uNMC3OQTHkFUsFq8r/BwAXLHvU/9O9mE0fBc/MY5iq/8H7ncvO947LmYA6ldWw9Uh8Yhf25zu6n7nML5QWQ==
  dependencies:
    get-intrinsic "^1.2.4"
    has-tostringtag "^1.0.2"
    hasown "^2.0.1"

es-shim-unscopables@^1.0.0, es-shim-unscopables@^1.0.2:
  version "1.0.2"
  resolved "https://registry.yarnpkg.com/es-shim-unscopables/-/es-shim-unscopables-1.0.2.tgz#1f6942e71ecc7835ed1c8a83006d8771a63a3763"
  integrity sha512-J3yBRXCzDu4ULnQwxyToo/OjdMx6akgVC7K6few0a7F/0wLtmKKN7I73AH5T2836UuXRqN7Qg+IIUw/+YJksRw==
  dependencies:
    hasown "^2.0.0"

es-to-primitive@^1.2.1:
  version "1.2.1"
  resolved "https://registry.yarnpkg.com/es-to-primitive/-/es-to-primitive-1.2.1.tgz#e55cd4c9cdc188bcefb03b366c736323fc5c898a"
  integrity sha512-QCOllgZJtaUo9miYBcLChTUaHNjJF3PYs1VidD7AwiEj1kYxKeQTctLAezAOH5ZKRH0g2IgPn6KwB4IT8iRpvA==
  dependencies:
    is-callable "^1.1.4"
    is-date-object "^1.0.1"
    is-symbol "^1.0.2"

escalade@^3.2.0:
  version "3.2.0"
  resolved "https://registry.yarnpkg.com/escalade/-/escalade-3.2.0.tgz#011a3f69856ba189dffa7dc8fcce99d2a87903e5"
  integrity sha512-WUj2qlxaQtO4g6Pq5c29GTcWGDyd8itL8zTlipgECz3JesAiiOKotd8JU6otB3PACgG6xkJUyVhboMS+bje/jA==

escape-string-regexp@^4.0.0:
  version "4.0.0"
  resolved "https://registry.yarnpkg.com/escape-string-regexp/-/escape-string-regexp-4.0.0.tgz#14ba83a5d373e3d311e5afca29cf5bfad965bf34"
  integrity sha512-TtpcNJ3XAzx3Gq8sWRzJaVajRs0uVxA2YAkdb1jm2YkPz4G6egUFAyA3n5vtEIZefPk5Wa4UXbKuS5fKkJWdgA==

eslint-config-next@15.0.3:
  version "15.0.3"
  resolved "https://registry.yarnpkg.com/eslint-config-next/-/eslint-config-next-15.0.3.tgz#b483585260d5e55050d4ab87e053c88089ae12ee"
  integrity sha512-IGP2DdQQrgjcr4mwFPve4DrCqo7CVVez1WoYY47XwKSrYO4hC0Dlb+iJA60i0YfICOzgNADIb8r28BpQ5Zs0wg==
  dependencies:
    "@next/eslint-plugin-next" "15.0.3"
    "@rushstack/eslint-patch" "^1.10.3"
    "@typescript-eslint/eslint-plugin" "^5.4.2 || ^6.0.0 || ^7.0.0 || ^8.0.0"
    "@typescript-eslint/parser" "^5.4.2 || ^6.0.0 || ^7.0.0 || ^8.0.0"
    eslint-import-resolver-node "^0.3.6"
    eslint-import-resolver-typescript "^3.5.2"
    eslint-plugin-import "^2.31.0"
    eslint-plugin-jsx-a11y "^6.10.0"
    eslint-plugin-react "^7.35.0"
    eslint-plugin-react-hooks "^5.0.0"

eslint-import-resolver-node@^0.3.6, eslint-import-resolver-node@^0.3.9:
  version "0.3.9"
  resolved "https://registry.yarnpkg.com/eslint-import-resolver-node/-/eslint-import-resolver-node-0.3.9.tgz#d4eaac52b8a2e7c3cd1903eb00f7e053356118ac"
  integrity sha512-WFj2isz22JahUv+B788TlO3N6zL3nNJGU8CcZbPZvVEkBPaJdCV4vy5wyghty5ROFbCRnm132v8BScu5/1BQ8g==
  dependencies:
    debug "^3.2.7"
    is-core-module "^2.13.0"
    resolve "^1.22.4"

eslint-import-resolver-typescript@^3.5.2:
  version "3.6.3"
  resolved "https://registry.yarnpkg.com/eslint-import-resolver-typescript/-/eslint-import-resolver-typescript-3.6.3.tgz#bb8e388f6afc0f940ce5d2c5fd4a3d147f038d9e"
  integrity sha512-ud9aw4szY9cCT1EWWdGv1L1XR6hh2PaRWif0j2QjQ0pgTY/69iw+W0Z4qZv5wHahOl8isEr+k/JnyAqNQkLkIA==
  dependencies:
    "@nolyfill/is-core-module" "1.0.39"
    debug "^4.3.5"
    enhanced-resolve "^5.15.0"
    eslint-module-utils "^2.8.1"
    fast-glob "^3.3.2"
    get-tsconfig "^4.7.5"
    is-bun-module "^1.0.2"
    is-glob "^4.0.3"

eslint-module-utils@^2.12.0, eslint-module-utils@^2.8.1:
  version "2.12.0"
  resolved "https://registry.yarnpkg.com/eslint-module-utils/-/eslint-module-utils-2.12.0.tgz#fe4cfb948d61f49203d7b08871982b65b9af0b0b"
  integrity sha512-wALZ0HFoytlyh/1+4wuZ9FJCD/leWHQzzrxJ8+rebyReSLk7LApMyd3WJaLVoN+D5+WIdJyDK1c6JnE65V4Zyg==
  dependencies:
    debug "^3.2.7"

eslint-plugin-import@^2.31.0:
  version "2.31.0"
  resolved "https://registry.yarnpkg.com/eslint-plugin-import/-/eslint-plugin-import-2.31.0.tgz#310ce7e720ca1d9c0bb3f69adfd1c6bdd7d9e0e7"
  integrity sha512-ixmkI62Rbc2/w8Vfxyh1jQRTdRTF52VxwRVHl/ykPAmqG+Nb7/kNn+byLP0LxPgI7zWA16Jt82SybJInmMia3A==
  dependencies:
    "@rtsao/scc" "^1.1.0"
    array-includes "^3.1.8"
    array.prototype.findlastindex "^1.2.5"
    array.prototype.flat "^1.3.2"
    array.prototype.flatmap "^1.3.2"
    debug "^3.2.7"
    doctrine "^2.1.0"
    eslint-import-resolver-node "^0.3.9"
    eslint-module-utils "^2.12.0"
    hasown "^2.0.2"
    is-core-module "^2.15.1"
    is-glob "^4.0.3"
    minimatch "^3.1.2"
    object.fromentries "^2.0.8"
    object.groupby "^1.0.3"
    object.values "^1.2.0"
    semver "^6.3.1"
    string.prototype.trimend "^1.0.8"
    tsconfig-paths "^3.15.0"

eslint-plugin-jsx-a11y@^6.10.0:
  version "6.10.2"
  resolved "https://registry.yarnpkg.com/eslint-plugin-jsx-a11y/-/eslint-plugin-jsx-a11y-6.10.2.tgz#d2812bb23bf1ab4665f1718ea442e8372e638483"
  integrity sha512-scB3nz4WmG75pV8+3eRUQOHZlNSUhFNq37xnpgRkCCELU3XMvXAxLk1eqWWyE22Ki4Q01Fnsw9BA3cJHDPgn2Q==
  dependencies:
    aria-query "^5.3.2"
    array-includes "^3.1.8"
    array.prototype.flatmap "^1.3.2"
    ast-types-flow "^0.0.8"
    axe-core "^4.10.0"
    axobject-query "^4.1.0"
    damerau-levenshtein "^1.0.8"
    emoji-regex "^9.2.2"
    hasown "^2.0.2"
    jsx-ast-utils "^3.3.5"
    language-tags "^1.0.9"
    minimatch "^3.1.2"
    object.fromentries "^2.0.8"
    safe-regex-test "^1.0.3"
    string.prototype.includes "^2.0.1"

eslint-plugin-react-hooks@^5.0.0:
  version "5.0.0"
  resolved "https://registry.yarnpkg.com/eslint-plugin-react-hooks/-/eslint-plugin-react-hooks-5.0.0.tgz#72e2eefbac4b694f5324154619fee44f5f60f101"
  integrity sha512-hIOwI+5hYGpJEc4uPRmz2ulCjAGD/N13Lukkh8cLV0i2IRk/bdZDYjgLVHj+U9Z704kLIdIO6iueGvxNur0sgw==

eslint-plugin-react@^7.35.0:
  version "7.37.2"
  resolved "https://registry.yarnpkg.com/eslint-plugin-react/-/eslint-plugin-react-7.37.2.tgz#cd0935987876ba2900df2f58339f6d92305acc7a"
  integrity sha512-EsTAnj9fLVr/GZleBLFbj/sSuXeWmp1eXIN60ceYnZveqEaUCyW4X+Vh4WTdUhCkW4xutXYqTXCUSyqD4rB75w==
  dependencies:
    array-includes "^3.1.8"
    array.prototype.findlast "^1.2.5"
    array.prototype.flatmap "^1.3.2"
    array.prototype.tosorted "^1.1.4"
    doctrine "^2.1.0"
    es-iterator-helpers "^1.1.0"
    estraverse "^5.3.0"
    hasown "^2.0.2"
    jsx-ast-utils "^2.4.1 || ^3.0.0"
    minimatch "^3.1.2"
    object.entries "^1.1.8"
    object.fromentries "^2.0.8"
    object.values "^1.2.0"
    prop-types "^15.8.1"
    resolve "^2.0.0-next.5"
    semver "^6.3.1"
    string.prototype.matchall "^4.0.11"
    string.prototype.repeat "^1.0.0"

eslint-scope@^7.2.2:
  version "7.2.2"
  resolved "https://registry.yarnpkg.com/eslint-scope/-/eslint-scope-7.2.2.tgz#deb4f92563390f32006894af62a22dba1c46423f"
  integrity sha512-dOt21O7lTMhDM+X9mB4GX+DZrZtCUJPL/wlcTqxyrx5IvO0IYtILdtrQGQp+8n5S0gwSVmOf9NQrjMOgfQZlIg==
  dependencies:
    esrecurse "^4.3.0"
    estraverse "^5.2.0"

eslint-visitor-keys@^3.4.1, eslint-visitor-keys@^3.4.3:
  version "3.4.3"
  resolved "https://registry.yarnpkg.com/eslint-visitor-keys/-/eslint-visitor-keys-3.4.3.tgz#0cd72fe8550e3c2eae156a96a4dddcd1c8ac5800"
  integrity sha512-wpc+LXeiyiisxPlEkUzU6svyS1frIO3Mgxj1fdy7Pm8Ygzguax2N3Fa/D/ag1WqbOprdI+uY6wMUl8/a2G+iag==

eslint@^8:
  version "8.57.1"
  resolved "https://registry.yarnpkg.com/eslint/-/eslint-8.57.1.tgz#7df109654aba7e3bbe5c8eae533c5e461d3c6ca9"
  integrity sha512-ypowyDxpVSYpkXr9WPv2PAZCtNip1Mv5KTW0SCurXv/9iOpcrH9PaqUElksqEB6pChqHGDRCFTyrZlGhnLNGiA==
  dependencies:
    "@eslint-community/eslint-utils" "^4.2.0"
    "@eslint-community/regexpp" "^4.6.1"
    "@eslint/eslintrc" "^2.1.4"
    "@eslint/js" "8.57.1"
    "@humanwhocodes/config-array" "^0.13.0"
    "@humanwhocodes/module-importer" "^1.0.1"
    "@nodelib/fs.walk" "^1.2.8"
    "@ungap/structured-clone" "^1.2.0"
    ajv "^6.12.4"
    chalk "^4.0.0"
    cross-spawn "^7.0.2"
    debug "^4.3.2"
    doctrine "^3.0.0"
    escape-string-regexp "^4.0.0"
    eslint-scope "^7.2.2"
    eslint-visitor-keys "^3.4.3"
    espree "^9.6.1"
    esquery "^1.4.2"
    esutils "^2.0.2"
    fast-deep-equal "^3.1.3"
    file-entry-cache "^6.0.1"
    find-up "^5.0.0"
    glob-parent "^6.0.2"
    globals "^13.19.0"
    graphemer "^1.4.0"
    ignore "^5.2.0"
    imurmurhash "^0.1.4"
    is-glob "^4.0.0"
    is-path-inside "^3.0.3"
    js-yaml "^4.1.0"
    json-stable-stringify-without-jsonify "^1.0.1"
    levn "^0.4.1"
    lodash.merge "^4.6.2"
    minimatch "^3.1.2"
    natural-compare "^1.4.0"
    optionator "^0.9.3"
    strip-ansi "^6.0.1"
    text-table "^0.2.0"

espree@^9.6.0, espree@^9.6.1:
  version "9.6.1"
  resolved "https://registry.yarnpkg.com/espree/-/espree-9.6.1.tgz#a2a17b8e434690a5432f2f8018ce71d331a48c6f"
  integrity sha512-oruZaFkjorTpF32kDSI5/75ViwGeZginGGy2NoOSg3Q9bnwlnmDm4HLnkl0RE3n+njDXR037aY1+x58Z/zFdwQ==
  dependencies:
    acorn "^8.9.0"
    acorn-jsx "^5.3.2"
    eslint-visitor-keys "^3.4.1"

esquery@^1.4.2:
  version "1.6.0"
  resolved "https://registry.yarnpkg.com/esquery/-/esquery-1.6.0.tgz#91419234f804d852a82dceec3e16cdc22cf9dae7"
  integrity sha512-ca9pw9fomFcKPvFLXhBKUK90ZvGibiGOvRJNbjljY7s7uq/5YO4BOzcYtJqExdx99rF6aAcnRxHmcUHcz6sQsg==
  dependencies:
    estraverse "^5.1.0"

esrecurse@^4.3.0:
  version "4.3.0"
  resolved "https://registry.yarnpkg.com/esrecurse/-/esrecurse-4.3.0.tgz#7ad7964d679abb28bee72cec63758b1c5d2c9921"
  integrity sha512-KmfKL3b6G+RXvP8N1vr3Tq1kL/oCFgn2NYXEtqP8/L3pKapUA4G8cFVaoF3SU323CD4XypR/ffioHmkti6/Tag==
  dependencies:
    estraverse "^5.2.0"

estraverse@^5.1.0, estraverse@^5.2.0, estraverse@^5.3.0:
  version "5.3.0"
  resolved "https://registry.yarnpkg.com/estraverse/-/estraverse-5.3.0.tgz#2eea5290702f26ab8fe5370370ff86c965d21123"
  integrity sha512-MMdARuVEQziNTeJD8DgMqmhwR11BRQ/cBP+pLtYdSTnf3MIO8fFeiINEbX36ZdNlfU/7A9f3gUw49B3oQsvwBA==

esutils@^2.0.2:
  version "2.0.3"
  resolved "https://registry.yarnpkg.com/esutils/-/esutils-2.0.3.tgz#74d2eb4de0b8da1293711910d50775b9b710ef64"
  integrity sha512-kVscqXk4OCp68SZ0dkgEKVi6/8ij300KBWTJq32P/dYeWTSwK41WyTxalN1eRmA5Z9UU/LX9D7FWSmV9SAYx6g==

execa@^7.0.0:
  version "7.2.0"
  resolved "https://registry.yarnpkg.com/execa/-/execa-7.2.0.tgz#657e75ba984f42a70f38928cedc87d6f2d4fe4e9"
  integrity sha512-UduyVP7TLB5IcAQl+OzLyLcS/l32W/GLg+AhHJ+ow40FOk2U3SAllPwR44v4vmdFwIWqpdwxxpQbF1n5ta9seA==
  dependencies:
    cross-spawn "^7.0.3"
    get-stream "^6.0.1"
    human-signals "^4.3.0"
    is-stream "^3.0.0"
    merge-stream "^2.0.0"
    npm-run-path "^5.1.0"
    onetime "^6.0.0"
    signal-exit "^3.0.7"
    strip-final-newline "^3.0.0"

fast-deep-equal@^3.1.1, fast-deep-equal@^3.1.3:
  version "3.1.3"
  resolved "https://registry.yarnpkg.com/fast-deep-equal/-/fast-deep-equal-3.1.3.tgz#3a7d56b559d6cbc3eb512325244e619a65c6c525"
  integrity sha512-f3qQ9oQy9j2AhBe/H9VC91wLmKBCCU/gDOnKNAYG5hswO7BLKj09Hc5HYNz9cGI++xlpDCIgDaitVs03ATR84Q==

fast-glob@3.3.1:
  version "3.3.1"
  resolved "https://registry.yarnpkg.com/fast-glob/-/fast-glob-3.3.1.tgz#784b4e897340f3dbbef17413b3f11acf03c874c4"
  integrity sha512-kNFPyjhh5cKjrUltxs+wFx+ZkbRaxxmZ+X0ZU31SOsxCEtP9VPgtq2teZw1DebupL5GmDaNQ6yKMMVcM41iqDg==
  dependencies:
    "@nodelib/fs.stat" "^2.0.2"
    "@nodelib/fs.walk" "^1.2.3"
    glob-parent "^5.1.2"
    merge2 "^1.3.0"
    micromatch "^4.0.4"

fast-glob@^3.3.0, fast-glob@^3.3.2:
  version "3.3.2"
  resolved "https://registry.yarnpkg.com/fast-glob/-/fast-glob-3.3.2.tgz#a904501e57cfdd2ffcded45e99a54fef55e46129"
  integrity sha512-oX2ruAFQwf/Orj8m737Y5adxDQO0LAB7/S5MnxCdTNDd4p6BsyIVsv9JQsATbTSq8KHRpLwIHbVlUNatxd+1Ow==
  dependencies:
    "@nodelib/fs.stat" "^2.0.2"
    "@nodelib/fs.walk" "^1.2.3"
    glob-parent "^5.1.2"
    merge2 "^1.3.0"
    micromatch "^4.0.4"

fast-json-stable-stringify@^2.0.0:
  version "2.1.0"
  resolved "https://registry.yarnpkg.com/fast-json-stable-stringify/-/fast-json-stable-stringify-2.1.0.tgz#874bf69c6f404c2b5d99c481341399fd55892633"
  integrity sha512-lhd/wF+Lk98HZoTCtlVraHtfh5XYijIjalXck7saUtuanSDyLMxnHhSXEDJqHxD7msR8D0uCmqlkwjCV8xvwHw==

fast-levenshtein@^2.0.6:
  version "2.0.6"
  resolved "https://registry.yarnpkg.com/fast-levenshtein/-/fast-levenshtein-2.0.6.tgz#3d8a5c66883a16a30ca8643e851f19baa7797917"
  integrity sha512-DCXu6Ifhqcks7TZKY3Hxp3y6qphY5SJZmrWMDrKcERSOXWQdMhU9Ig/PYrzyw/ul9jOIyh0N4M0tbC5hodg8dw==

fastq@^1.6.0:
  version "1.17.1"
  resolved "https://registry.yarnpkg.com/fastq/-/fastq-1.17.1.tgz#2a523f07a4e7b1e81a42b91b8bf2254107753b47"
  integrity sha512-sRVD3lWVIXWg6By68ZN7vho9a1pQcN/WBFaAAsDDFzlJjvoGx0P8z7V1t72grFJfJhu3YPZBuu25f7Kaw2jN1w==
  dependencies:
    reusify "^1.0.4"

fetch-blob@^3.1.2, fetch-blob@^3.1.4:
  version "3.2.0"
  resolved "https://registry.yarnpkg.com/fetch-blob/-/fetch-blob-3.2.0.tgz#f09b8d4bbd45adc6f0c20b7e787e793e309dcce9"
  integrity sha512-7yAQpD2UMJzLi1Dqv7qFYnPbaPx7ZfFK6PiIxQ4PfkGPyNyl2Ugx+a/umUonmKqjhM4DnfbMvdX6otXq83soQQ==
  dependencies:
    node-domexception "^1.0.0"
    web-streams-polyfill "^3.0.3"

file-entry-cache@^6.0.1:
  version "6.0.1"
  resolved "https://registry.yarnpkg.com/file-entry-cache/-/file-entry-cache-6.0.1.tgz#211b2dd9659cb0394b073e7323ac3c933d522027"
  integrity sha512-7Gps/XWymbLk2QLYK4NzpMOrYjMhdIxXuIvy2QBsLE6ljuodKvdkWs/cpyJJ3CVIVpH0Oi1Hvg1ovbMzLdFBBg==
  dependencies:
    flat-cache "^3.0.4"

fill-range@^7.1.1:
  version "7.1.1"
  resolved "https://registry.yarnpkg.com/fill-range/-/fill-range-7.1.1.tgz#44265d3cac07e3ea7dc247516380643754a05292"
  integrity sha512-YsGpe3WHLK8ZYi4tWDg2Jy3ebRz2rXowDxnld4bkQB00cc/1Zw9AWnC0i9ztDJitivtQvaI9KaLyKrc+hBW0yg==
  dependencies:
    to-regex-range "^5.0.1"

find-up@^5.0.0:
  version "5.0.0"
  resolved "https://registry.yarnpkg.com/find-up/-/find-up-5.0.0.tgz#4c92819ecb7083561e4f4a240a86be5198f536fc"
  integrity sha512-78/PXT1wlLLDgTzDs7sjq9hzz0vXD+zn+7wypEe4fXQxCmdmqfGsEPQxmiCSQI3ajFV91bVSsvNtrJRiW6nGng==
  dependencies:
    locate-path "^6.0.0"
    path-exists "^4.0.0"

flat-cache@^3.0.4:
  version "3.2.0"
  resolved "https://registry.yarnpkg.com/flat-cache/-/flat-cache-3.2.0.tgz#2c0c2d5040c99b1632771a9d105725c0115363ee"
  integrity sha512-CYcENa+FtcUKLmhhqyctpclsq7QF38pKjZHsGNiSQF5r4FtoKDWabFDl3hzaEQMvT1LHEysw5twgLvpYYb4vbw==
  dependencies:
    flatted "^3.2.9"
    keyv "^4.5.3"
    rimraf "^3.0.2"

flatted@^3.2.9:
  version "3.3.1"
  resolved "https://registry.yarnpkg.com/flatted/-/flatted-3.3.1.tgz#21db470729a6734d4997002f439cb308987f567a"
  integrity sha512-X8cqMLLie7KsNUDSdzeN8FYK9rEt4Dt67OsG/DNGnYTSDBG4uFAJFBnUeiV+zCVAvwFy56IjM9sH51jVaEhNxw==

for-each@^0.3.3:
  version "0.3.3"
  resolved "https://registry.yarnpkg.com/for-each/-/for-each-0.3.3.tgz#69b447e88a0a5d32c3e7084f3f1710034b21376e"
  integrity sha512-jqYfLp7mo9vIyQf8ykW2v7A+2N4QjeCeI5+Dz9XraiO1ign81wjiH7Fb9vSOWvQfNtmSa4H2RoQTrrXivdUZmw==
  dependencies:
    is-callable "^1.1.3"

foreground-child@^3.1.0:
  version "3.3.0"
  resolved "https://registry.yarnpkg.com/foreground-child/-/foreground-child-3.3.0.tgz#0ac8644c06e431439f8561db8ecf29a7b5519c77"
  integrity sha512-Ld2g8rrAyMYFXBhEqMz8ZAHBi4J4uS1i/CxGMDnjyFWddMXLVcDp051DZfu+t7+ab7Wv6SMqpWmyFIj5UbfFvg==
  dependencies:
    cross-spawn "^7.0.0"
    signal-exit "^4.0.1"

formdata-polyfill@^4.0.10:
  version "4.0.10"
  resolved "https://registry.yarnpkg.com/formdata-polyfill/-/formdata-polyfill-4.0.10.tgz#24807c31c9d402e002ab3d8c720144ceb8848423"
  integrity sha512-buewHzMvYL29jdeQTVILecSaZKnt/RJWjoZCF5OW60Z67/GmSLBkOFM7qh1PI3zFNtJbaZL5eQu1vLfazOwj4g==
  dependencies:
    fetch-blob "^3.1.2"

fraction.js@^4.3.7:
  version "4.3.7"
  resolved "https://registry.yarnpkg.com/fraction.js/-/fraction.js-4.3.7.tgz#06ca0085157e42fda7f9e726e79fefc4068840f7"
  integrity sha512-ZsDfxO51wGAXREY55a7la9LScWpwv9RxIrYABrlvOFBlH/ShPnrtsXeuUIfXKKOVicNxQ+o8JTbJvjS4M89yew==

fs-extra@^11.1.0:
  version "11.2.0"
  resolved "https://registry.yarnpkg.com/fs-extra/-/fs-extra-11.2.0.tgz#e70e17dfad64232287d01929399e0ea7c86b0e5b"
  integrity sha512-PmDi3uwK5nFuXh7XDTlVnS17xJS7vW36is2+w3xcv8SVxiB4NyATf4ctkVY5bkSjX0Y4nbvZCq1/EjtEyr9ktw==
  dependencies:
    graceful-fs "^4.2.0"
    jsonfile "^6.0.1"
    universalify "^2.0.0"

fs.realpath@^1.0.0:
  version "1.0.0"
  resolved "https://registry.yarnpkg.com/fs.realpath/-/fs.realpath-1.0.0.tgz#1504ad2523158caa40db4a2787cb01411994ea4f"
  integrity sha512-OO0pH2lK6a0hZnAdau5ItzHPI6pUlvI7jMVnxUQRtw4owF2wk8lOSabtGDCTP4Ggrg2MbGnWO9X8K1t4+fGMDw==

fsevents@~2.3.2:
  version "2.3.3"
  resolved "https://registry.yarnpkg.com/fsevents/-/fsevents-2.3.3.tgz#cac6407785d03675a2a5e1a5305c697b347d90d6"
  integrity sha512-5xoDfX+fL7faATnagmWPpbFtwh/R77WmMMqqHGS65C3vvB0YHrgF+B1YmZ3441tMj5n63k0212XNoJwzlhffQw==

function-bind@^1.1.2:
  version "1.1.2"
  resolved "https://registry.yarnpkg.com/function-bind/-/function-bind-1.1.2.tgz#2c02d864d97f3ea6c8830c464cbd11ab6eab7a1c"
  integrity sha512-7XHNxH7qX9xG5mIwxkhumTox/MIRNcOgDrxWsMt2pAr23WHp6MrRlN7FBSFpCpr+oVO0F744iUgR82nJMfG2SA==

function.prototype.name@^1.1.6:
  version "1.1.6"
  resolved "https://registry.yarnpkg.com/function.prototype.name/-/function.prototype.name-1.1.6.tgz#cdf315b7d90ee77a4c6ee216c3c3362da07533fd"
  integrity sha512-Z5kx79swU5P27WEayXM1tBi5Ze/lbIyiNgU3qyXUOf9b2rgXYyF9Dy9Cx+IQv/Lc8WCG6L82zwUPpSS9hGehIg==
  dependencies:
    call-bind "^1.0.2"
    define-properties "^1.2.0"
    es-abstract "^1.22.1"
    functions-have-names "^1.2.3"

functions-have-names@^1.2.3:
  version "1.2.3"
  resolved "https://registry.yarnpkg.com/functions-have-names/-/functions-have-names-1.2.3.tgz#0404fe4ee2ba2f607f0e0ec3c80bae994133b834"
  integrity sha512-xckBUXyTIqT97tq2x2AMb+g163b5JFysYk0x4qxNFwbfQkmNZoiRHb6sPzI9/QV33WeuvVYBUIiD4NzNIyqaRQ==

get-intrinsic@^1.1.3, get-intrinsic@^1.2.1, get-intrinsic@^1.2.3, get-intrinsic@^1.2.4:
  version "1.2.4"
  resolved "https://registry.yarnpkg.com/get-intrinsic/-/get-intrinsic-1.2.4.tgz#e385f5a4b5227d449c3eabbad05494ef0abbeadd"
  integrity sha512-5uYhsJH8VJBTv7oslg4BznJYhDoRI6waYCxMmCdnTrcCrHA/fCFKoTFz2JKKE0HdDFUF7/oQuhzumXJK7paBRQ==
  dependencies:
    es-errors "^1.3.0"
    function-bind "^1.1.2"
    has-proto "^1.0.1"
    has-symbols "^1.0.3"
    hasown "^2.0.0"

get-nonce@^1.0.0:
  version "1.0.1"
  resolved "https://registry.yarnpkg.com/get-nonce/-/get-nonce-1.0.1.tgz#fdf3f0278073820d2ce9426c18f07481b1e0cdf3"
  integrity sha512-FJhYRoDaiatfEkUK8HKlicmu/3SGFD51q3itKDGoSTysQJBnfOcxU5GxnhE1E6soB76MbT0MBtnKJuXyAx+96Q==

get-stream@^6.0.1:
  version "6.0.1"
  resolved "https://registry.yarnpkg.com/get-stream/-/get-stream-6.0.1.tgz#a262d8eef67aced57c2852ad6167526a43cbf7b7"
  integrity sha512-ts6Wi+2j3jQjqi70w5AlN8DFnkSwC+MqmxEzdEALB2qXZYV3X/b1CTfgPLGJNMeAWxdPfU8FO1ms3NUfaHCPYg==

get-symbol-description@^1.0.2:
  version "1.0.2"
  resolved "https://registry.yarnpkg.com/get-symbol-description/-/get-symbol-description-1.0.2.tgz#533744d5aa20aca4e079c8e5daf7fd44202821f5"
  integrity sha512-g0QYk1dZBxGwk+Ngc+ltRH2IBp2f7zBkBMBJZCDerh6EhlhSR6+9irMCuT/09zD6qkarHUSn529sK/yL4S27mg==
  dependencies:
    call-bind "^1.0.5"
    es-errors "^1.3.0"
    get-intrinsic "^1.2.4"

get-tsconfig@^4.7.5:
  version "4.8.1"
  resolved "https://registry.yarnpkg.com/get-tsconfig/-/get-tsconfig-4.8.1.tgz#8995eb391ae6e1638d251118c7b56de7eb425471"
  integrity sha512-k9PN+cFBmaLWtVz29SkUoqU5O0slLuHJXt/2P+tMVFT+phsSGXGkp9t3rQIqdz0e+06EHNGs3oM6ZX1s2zHxRg==
  dependencies:
    resolve-pkg-maps "^1.0.0"

glob-parent@^5.1.2, glob-parent@~5.1.2:
  version "5.1.2"
  resolved "https://registry.yarnpkg.com/glob-parent/-/glob-parent-5.1.2.tgz#869832c58034fe68a4093c17dc15e8340d8401c4"
  integrity sha512-AOIgSQCepiJYwP3ARnGx+5VnTu2HBYdzbGP45eLw1vr3zB3vZLeyed1sC9hnbcOc9/SrMyM5RPQrkGz4aS9Zow==
  dependencies:
    is-glob "^4.0.1"

glob-parent@^6.0.2:
  version "6.0.2"
  resolved "https://registry.yarnpkg.com/glob-parent/-/glob-parent-6.0.2.tgz#6d237d99083950c79290f24c7642a3de9a28f9e3"
  integrity sha512-XxwI8EOhVQgWp6iDL+3b0r86f4d6AX6zSU55HfB4ydCEuXLXc5FcYeOu+nnGftS4TEju/11rt4KJPTMgbfmv4A==
  dependencies:
    is-glob "^4.0.3"

glob@^10.3.10:
  version "10.4.5"
  resolved "https://registry.yarnpkg.com/glob/-/glob-10.4.5.tgz#f4d9f0b90ffdbab09c9d77f5f29b4262517b0956"
  integrity sha512-7Bv8RF0k6xjo7d4A/PxYLbUCfb6c+Vpd2/mB2yRDlew7Jb5hEXiCD9ibfO7wpk8i4sevK6DFny9h7EYbM3/sHg==
  dependencies:
    foreground-child "^3.1.0"
    jackspeak "^3.1.2"
    minimatch "^9.0.4"
    minipass "^7.1.2"
    package-json-from-dist "^1.0.0"
    path-scurry "^1.11.1"

glob@^7.1.3:
  version "7.2.3"
  resolved "https://registry.yarnpkg.com/glob/-/glob-7.2.3.tgz#b8df0fb802bbfa8e89bd1d938b4e16578ed44f2b"
  integrity sha512-nFR0zLpU2YCaRxwoCJvL6UvCH2JFyFVIvwTLsIf21AuHlMskA1hhTdk+LlYJtOlYt9v6dvszD2BGRqBL+iQK9Q==
  dependencies:
    fs.realpath "^1.0.0"
    inflight "^1.0.4"
    inherits "2"
    minimatch "^3.1.1"
    once "^1.3.0"
    path-is-absolute "^1.0.0"

globals@^13.19.0:
  version "13.24.0"
  resolved "https://registry.yarnpkg.com/globals/-/globals-13.24.0.tgz#8432a19d78ce0c1e833949c36adb345400bb1171"
  integrity sha512-AhO5QUcj8llrbG09iWhPU2B204J1xnPeL8kQmVorSsy+Sjj1sk8gIyh6cUocGmH4L0UuhAJy+hJMRA4mgA4mFQ==
  dependencies:
    type-fest "^0.20.2"

globalthis@^1.0.3, globalthis@^1.0.4:
  version "1.0.4"
  resolved "https://registry.yarnpkg.com/globalthis/-/globalthis-1.0.4.tgz#7430ed3a975d97bfb59bcce41f5cabbafa651236"
  integrity sha512-DpLKbNU4WylpxJykQujfCcwYWiV/Jhm50Goo0wrVILAv5jOr9d+H+UR3PhSCD2rCCEIg0uc+G+muBTwD54JhDQ==
  dependencies:
    define-properties "^1.2.1"
    gopd "^1.0.1"

gopd@^1.0.1:
  version "1.0.1"
  resolved "https://registry.yarnpkg.com/gopd/-/gopd-1.0.1.tgz#29ff76de69dac7489b7c0918a5788e56477c332c"
  integrity sha512-d65bNlIadxvpb/A2abVdlqKqV563juRnZ1Wtk6s1sIR8uNsXR70xqIzVqxVf1eTqDunwT2MkczEeaezCKTZhwA==
  dependencies:
    get-intrinsic "^1.1.3"

graceful-fs@^4.1.6, graceful-fs@^4.2.0, graceful-fs@^4.2.4:
  version "4.2.11"
  resolved "https://registry.yarnpkg.com/graceful-fs/-/graceful-fs-4.2.11.tgz#4183e4e8bf08bb6e05bbb2f7d2e0c8f712ca40e3"
  integrity sha512-RbJ5/jmFcNNCcDV5o9eTnBLJ/HszWV0P73bc+Ff4nS/rJj+YaS6IGyiOL0VoBYX+l1Wrl3k63h/KrH+nhJ0XvQ==

graphemer@^1.4.0:
  version "1.4.0"
  resolved "https://registry.yarnpkg.com/graphemer/-/graphemer-1.4.0.tgz#fb2f1d55e0e3a1849aeffc90c4fa0dd53a0e66c6"
  integrity sha512-EtKwoO6kxCL9WO5xipiHTZlSzBm7WLT627TqC/uVRd0HKmq8NXyebnNYxDoBi7wt8eTWrUrKXCOVaFq9x1kgag==

has-bigints@^1.0.1, has-bigints@^1.0.2:
  version "1.0.2"
  resolved "https://registry.yarnpkg.com/has-bigints/-/has-bigints-1.0.2.tgz#0871bd3e3d51626f6ca0966668ba35d5602d6eaa"
  integrity sha512-tSvCKtBr9lkF0Ex0aQiP9N+OpV4zi2r/Nee5VkRDbaqv35RLYMzbwQfFSZZH0kR+Rd6302UJZ2p/bJCEoR3VoQ==

has-flag@^4.0.0:
  version "4.0.0"
  resolved "https://registry.yarnpkg.com/has-flag/-/has-flag-4.0.0.tgz#944771fd9c81c81265c4d6941860da06bb59479b"
  integrity sha512-EykJT/Q1KjTWctppgIAgfSO0tKVuZUjhgMr17kqTumMl6Afv3EISleU7qZUzoXDFTAHTDC4NOoG/ZxU3EvlMPQ==

has-property-descriptors@^1.0.0, has-property-descriptors@^1.0.2:
  version "1.0.2"
  resolved "https://registry.yarnpkg.com/has-property-descriptors/-/has-property-descriptors-1.0.2.tgz#963ed7d071dc7bf5f084c5bfbe0d1b6222586854"
  integrity sha512-55JNKuIW+vq4Ke1BjOTjM2YctQIvCT7GFzHwmfZPGo5wnrgkid0YQtnAleFSqumZm4az3n2BS+erby5ipJdgrg==
  dependencies:
    es-define-property "^1.0.0"

has-proto@^1.0.1, has-proto@^1.0.3:
  version "1.0.3"
  resolved "https://registry.yarnpkg.com/has-proto/-/has-proto-1.0.3.tgz#b31ddfe9b0e6e9914536a6ab286426d0214f77fd"
  integrity sha512-SJ1amZAJUiZS+PhsVLf5tGydlaVB8EdFpaSO4gmiUKUOxk8qzn5AIy4ZeJUmh22znIdk/uMAUT2pl3FxzVUH+Q==

has-symbols@^1.0.2, has-symbols@^1.0.3:
  version "1.0.3"
  resolved "https://registry.yarnpkg.com/has-symbols/-/has-symbols-1.0.3.tgz#bb7b2c4349251dce87b125f7bdf874aa7c8b39f8"
  integrity sha512-l3LCuF6MgDNwTDKkdYGEihYjt5pRPbEg46rtlmnSPlUbgmB8LOIrKJbYYFBSbnPaJexMKtiPO8hmeRjRz2Td+A==

has-tostringtag@^1.0.0, has-tostringtag@^1.0.2:
  version "1.0.2"
  resolved "https://registry.yarnpkg.com/has-tostringtag/-/has-tostringtag-1.0.2.tgz#2cdc42d40bef2e5b4eeab7c01a73c54ce7ab5abc"
  integrity sha512-NqADB8VjPFLM2V0VvHUewwwsw0ZWBaIdgo+ieHtK3hasLz4qeCRjYcqfB6AQrBggRKppKF8L52/VqdVsO47Dlw==
  dependencies:
    has-symbols "^1.0.3"

hasown@^2.0.0, hasown@^2.0.1, hasown@^2.0.2:
  version "2.0.2"
  resolved "https://registry.yarnpkg.com/hasown/-/hasown-2.0.2.tgz#003eaf91be7adc372e84ec59dc37252cedb80003"
  integrity sha512-0hJU9SCPvmMzIBdZFqNPXWa6dqh7WdH0cII9y+CyS8rG3nL48Bclra9HmKhVVUHyPWNH5Y7xDwAB7bfgSjkUMQ==
  dependencies:
    function-bind "^1.1.2"

human-signals@^4.3.0:
  version "4.3.1"
  resolved "https://registry.yarnpkg.com/human-signals/-/human-signals-4.3.1.tgz#ab7f811e851fca97ffbd2c1fe9a958964de321b2"
  integrity sha512-nZXjEF2nbo7lIw3mgYjItAfgQXog3OjJogSbKa2CQIIvSGWcKgeJnQlNXip6NglNzYH45nSRiEVimMvYL8DDqQ==

ieee754@^1.2.1:
  version "1.2.1"
  resolved "https://registry.yarnpkg.com/ieee754/-/ieee754-1.2.1.tgz#8eb7a10a63fff25d15a57b001586d177d1b0d352"
  integrity sha512-dcyqhDvX1C46lXZcVqCpK+FtMRQVdIMN6/Df5js2zouUsqG7I6sFxitIC+7KYK29KdXOLHdu9zL4sFnoVQnqaA==

ignore@^5.2.0, ignore@^5.3.1:
  version "5.3.2"
  resolved "https://registry.yarnpkg.com/ignore/-/ignore-5.3.2.tgz#3cd40e729f3643fd87cb04e50bf0eb722bc596f5"
  integrity sha512-hsBTNUqQTDwkWtcdYI2i06Y/nUBEsNEDJKjWdigLvegy8kDuJAS8uRlpkkcQpyEXL0Z/pjDy5HBmMjRCJ2gq+g==

import-fresh@^3.2.1:
  version "3.3.0"
  resolved "https://registry.yarnpkg.com/import-fresh/-/import-fresh-3.3.0.tgz#37162c25fcb9ebaa2e6e53d5b4d88ce17d9e0c2b"
  integrity sha512-veYYhQa+D1QBKznvhUHxb8faxlrwUnxseDAbAp457E0wLNio2bOSKnjYDhMj+YiAq61xrMGhQk9iXVk5FzgQMw==
  dependencies:
    parent-module "^1.0.0"
    resolve-from "^4.0.0"

imurmurhash@^0.1.4:
  version "0.1.4"
  resolved "https://registry.yarnpkg.com/imurmurhash/-/imurmurhash-0.1.4.tgz#9218b9b2b928a238b13dc4fb6b6d576f231453ea"
  integrity sha512-JmXMZ6wuvDmLiHEml9ykzqO6lwFbof0GG4IkcGaENdCRDDmMVnny7s5HsIgHCbaq0w2MyPhDqkhTUgS2LU2PHA==

inflight@^1.0.4:
  version "1.0.6"
  resolved "https://registry.yarnpkg.com/inflight/-/inflight-1.0.6.tgz#49bd6331d7d02d0c09bc910a1075ba8165b56df9"
  integrity sha512-k92I/b08q4wvFscXCLvqfsHCrjrF7yiXsQuIVvVE7N82W3+aqpzuUdBbfhWcy/FZR3/4IgflMgKLOsvPDrGCJA==
  dependencies:
    once "^1.3.0"
    wrappy "1"

inherits@2, inherits@^2.0.3, inherits@^2.0.4:
  version "2.0.4"
  resolved "https://registry.yarnpkg.com/inherits/-/inherits-2.0.4.tgz#0fa2c64f932917c3433a0ded55363aae37416b7c"
  integrity sha512-k/vGaX4/Yla3WzyMCvTQOXYeIHvqOKtnqBduzTHpzpQZzAskKMhZ2K+EnBiSM9zGSoIFeMpXKxa4dYeZIQqewQ==

internal-slot@^1.0.7:
  version "1.0.7"
  resolved "https://registry.yarnpkg.com/internal-slot/-/internal-slot-1.0.7.tgz#c06dcca3ed874249881007b0a5523b172a190802"
  integrity sha512-NGnrKwXzSms2qUUih/ILZ5JBqNTSa1+ZmP6flaIp6KmSElgE9qdndzS3cqjrDovwFdmwsGsLdeFgB6suw+1e9g==
  dependencies:
    es-errors "^1.3.0"
    hasown "^2.0.0"
    side-channel "^1.0.4"

invariant@^2.2.4:
  version "2.2.4"
  resolved "https://registry.yarnpkg.com/invariant/-/invariant-2.2.4.tgz#610f3c92c9359ce1db616e538008d23ff35158e6"
  integrity sha512-phJfQVBuaJM5raOpJjSfkiD6BpbCE4Ns//LaXl6wGYtUBY83nWS6Rf9tXm2e8VaK60JEjYldbPif/A2B1C2gNA==
  dependencies:
    loose-envify "^1.0.0"

is-array-buffer@^3.0.4:
  version "3.0.4"
  resolved "https://registry.yarnpkg.com/is-array-buffer/-/is-array-buffer-3.0.4.tgz#7a1f92b3d61edd2bc65d24f130530ea93d7fae98"
  integrity sha512-wcjaerHw0ydZwfhiKbXJWLDY8A7yV7KhjQOpb83hGgGfId/aQa4TOvwyzn2PuswW2gPCYEL/nEAiSVpdOj1lXw==
  dependencies:
    call-bind "^1.0.2"
    get-intrinsic "^1.2.1"

is-arrayish@^0.3.1:
  version "0.3.2"
  resolved "https://registry.yarnpkg.com/is-arrayish/-/is-arrayish-0.3.2.tgz#4574a2ae56f7ab206896fb431eaeed066fdf8f03"
  integrity sha512-eVRqCvVlZbuw3GrM63ovNSNAeA1K16kaR/LRY/92w0zxQ5/1YzwblUX652i4Xs9RwAGjW9d9y6X88t8OaAJfWQ==

is-async-function@^2.0.0:
  version "2.0.0"
  resolved "https://registry.yarnpkg.com/is-async-function/-/is-async-function-2.0.0.tgz#8e4418efd3e5d3a6ebb0164c05ef5afb69aa9646"
  integrity sha512-Y1JXKrfykRJGdlDwdKlLpLyMIiWqWvuSd17TvZk68PLAOGOoF4Xyav1z0Xhoi+gCYjZVeC5SI+hYFOfvXmGRCA==
  dependencies:
    has-tostringtag "^1.0.0"

is-bigint@^1.0.1:
  version "1.0.4"
  resolved "https://registry.yarnpkg.com/is-bigint/-/is-bigint-1.0.4.tgz#08147a1875bc2b32005d41ccd8291dffc6691df3"
  integrity sha512-zB9CruMamjym81i2JZ3UMn54PKGsQzsJeo6xvN3HJJ4CAsQNB6iRutp2To77OfCNuoxspsIhzaPoO1zyCEhFOg==
  dependencies:
    has-bigints "^1.0.1"

is-binary-path@~2.1.0:
  version "2.1.0"
  resolved "https://registry.yarnpkg.com/is-binary-path/-/is-binary-path-2.1.0.tgz#ea1f7f3b80f064236e83470f86c09c254fb45b09"
  integrity sha512-ZMERYes6pDydyuGidse7OsHxtbI7WVeUEozgR/g7rd0xUimYNlvZRE/K2MgZTjWy725IfelLeVcEM97mmtRGXw==
  dependencies:
    binary-extensions "^2.0.0"

is-boolean-object@^1.1.0:
  version "1.1.2"
  resolved "https://registry.yarnpkg.com/is-boolean-object/-/is-boolean-object-1.1.2.tgz#5c6dc200246dd9321ae4b885a114bb1f75f63719"
  integrity sha512-gDYaKHJmnj4aWxyj6YHyXVpdQawtVLHU5cb+eztPGczf6cjuTdwve5ZIEfgXqH4e57An1D1AKf8CZ3kYrQRqYA==
  dependencies:
    call-bind "^1.0.2"
    has-tostringtag "^1.0.0"

is-bun-module@^1.0.2:
  version "1.2.1"
  resolved "https://registry.yarnpkg.com/is-bun-module/-/is-bun-module-1.2.1.tgz#495e706f42e29f086fd5fe1ac3c51f106062b9fc"
  integrity sha512-AmidtEM6D6NmUiLOvvU7+IePxjEjOzra2h0pSrsfSAcXwl/83zLLXDByafUJy9k/rKK0pvXMLdwKwGHlX2Ke6Q==
  dependencies:
    semver "^7.6.3"

is-callable@^1.1.3, is-callable@^1.1.4, is-callable@^1.2.7:
  version "1.2.7"
  resolved "https://registry.yarnpkg.com/is-callable/-/is-callable-1.2.7.tgz#3bc2a85ea742d9e36205dcacdd72ca1fdc51b055"
  integrity sha512-1BC0BVFhS/p0qtw6enp8e+8OD0UrK0oFLztSjNzhcKA3WDuJxxAPXzPuPtKkjEY9UUoEWlX/8fgKeu2S8i9JTA==

is-core-module@^2.13.0, is-core-module@^2.15.1:
  version "2.15.1"
  resolved "https://registry.yarnpkg.com/is-core-module/-/is-core-module-2.15.1.tgz#a7363a25bee942fefab0de13bf6aa372c82dcc37"
  integrity sha512-z0vtXSwucUJtANQWldhbtbt7BnL0vxiFjIdDLAatwhDYty2bad6s+rijD6Ri4YuYJubLzIJLUidCh09e1djEVQ==
  dependencies:
    hasown "^2.0.2"

is-data-view@^1.0.1:
  version "1.0.1"
  resolved "https://registry.yarnpkg.com/is-data-view/-/is-data-view-1.0.1.tgz#4b4d3a511b70f3dc26d42c03ca9ca515d847759f"
  integrity sha512-AHkaJrsUVW6wq6JS8y3JnM/GJF/9cf+k20+iDzlSaJrinEo5+7vRiteOSwBhHRiAyQATN1AmY4hwzxJKPmYf+w==
  dependencies:
    is-typed-array "^1.1.13"

is-date-object@^1.0.1, is-date-object@^1.0.5:
  version "1.0.5"
  resolved "https://registry.yarnpkg.com/is-date-object/-/is-date-object-1.0.5.tgz#0841d5536e724c25597bf6ea62e1bd38298df31f"
  integrity sha512-9YQaSxsAiSwcvS33MBk3wTCVnWK+HhF8VZR2jRxehM16QcVOdHqPn4VPHmRK4lSr38n9JriurInLcP90xsYNfQ==
  dependencies:
    has-tostringtag "^1.0.0"

is-extglob@^2.1.1:
  version "2.1.1"
  resolved "https://registry.yarnpkg.com/is-extglob/-/is-extglob-2.1.1.tgz#a88c02535791f02ed37c76a1b9ea9773c833f8c2"
  integrity sha512-SbKbANkN603Vi4jEZv49LeVJMn4yGwsbzZworEoyEiutsN3nJYdbO36zfhGJ6QEDpOZIFkDtnq5JRxmvl3jsoQ==

is-finalizationregistry@^1.0.2:
  version "1.0.2"
  resolved "https://registry.yarnpkg.com/is-finalizationregistry/-/is-finalizationregistry-1.0.2.tgz#c8749b65f17c133313e661b1289b95ad3dbd62e6"
  integrity sha512-0by5vtUJs8iFQb5TYUHHPudOR+qXYIMKtiUzvLIZITZUjknFmziyBJuLhVRc+Ds0dREFlskDNJKYIdIzu/9pfw==
  dependencies:
    call-bind "^1.0.2"

is-fullwidth-code-point@^3.0.0:
  version "3.0.0"
  resolved "https://registry.yarnpkg.com/is-fullwidth-code-point/-/is-fullwidth-code-point-3.0.0.tgz#f116f8064fe90b3f7844a38997c0b75051269f1d"
  integrity sha512-zymm5+u+sCsSWyD9qNaejV3DFvhCKclKdizYaJUuHA83RLjb7nSuGnddCHGv0hk+KY7BMAlsWeK4Ueg6EV6XQg==

is-generator-function@^1.0.10:
  version "1.0.10"
  resolved "https://registry.yarnpkg.com/is-generator-function/-/is-generator-function-1.0.10.tgz#f1558baf1ac17e0deea7c0415c438351ff2b3c72"
  integrity sha512-jsEjy9l3yiXEQ+PsXdmBwEPcOxaXWLspKdplFUVI9vq1iZgIekeC0L167qeu86czQaxed3q/Uzuw0swL0irL8A==
  dependencies:
    has-tostringtag "^1.0.0"

is-glob@^4.0.0, is-glob@^4.0.1, is-glob@^4.0.3, is-glob@~4.0.1:
  version "4.0.3"
  resolved "https://registry.yarnpkg.com/is-glob/-/is-glob-4.0.3.tgz#64f61e42cbbb2eec2071a9dac0b28ba1e65d5084"
  integrity sha512-xelSayHH36ZgE7ZWhli7pW34hNbNl8Ojv5KVmkJD4hBdD3th8Tfk9vYasLM+mXWOZhFkgZfxhLSnrwRr4elSSg==
  dependencies:
    is-extglob "^2.1.1"

is-interactive@^2.0.0:
  version "2.0.0"
  resolved "https://registry.yarnpkg.com/is-interactive/-/is-interactive-2.0.0.tgz#40c57614593826da1100ade6059778d597f16e90"
  integrity sha512-qP1vozQRI+BMOPcjFzrjXuQvdak2pHNUMZoeG2eRbiSqyvbEf/wQtEOTOX1guk6E3t36RkaqiSt8A/6YElNxLQ==

is-map@^2.0.3:
  version "2.0.3"
  resolved "https://registry.yarnpkg.com/is-map/-/is-map-2.0.3.tgz#ede96b7fe1e270b3c4465e3a465658764926d62e"
  integrity sha512-1Qed0/Hr2m+YqxnM09CjA2d/i6YZNfF6R2oRAOj36eUdS6qIV/huPJNSEpKbupewFs+ZsJlxsjjPbc0/afW6Lw==

is-negative-zero@^2.0.3:
  version "2.0.3"
  resolved "https://registry.yarnpkg.com/is-negative-zero/-/is-negative-zero-2.0.3.tgz#ced903a027aca6381b777a5743069d7376a49747"
  integrity sha512-5KoIu2Ngpyek75jXodFvnafB6DJgr3u8uuK0LEZJjrU19DrMD3EVERaR8sjz8CCGgpZvxPl9SuE1GMVPFHx1mw==

is-number-object@^1.0.4:
  version "1.0.7"
  resolved "https://registry.yarnpkg.com/is-number-object/-/is-number-object-1.0.7.tgz#59d50ada4c45251784e9904f5246c742f07a42fc"
  integrity sha512-k1U0IRzLMo7ZlYIfzRu23Oh6MiIFasgpb9X76eqfFZAqwH44UI4KTBvBYIZ1dSL9ZzChTB9ShHfLkR4pdW5krQ==
  dependencies:
    has-tostringtag "^1.0.0"

is-number@^7.0.0:
  version "7.0.0"
  resolved "https://registry.yarnpkg.com/is-number/-/is-number-7.0.0.tgz#7535345b896734d5f80c4d06c50955527a14f12b"
  integrity sha512-41Cifkg6e8TylSpdtTpeLVMqvSBEVzTttHvERD741+pnZ8ANv0004MRL43QKPDlK9cGvNp6NZWZUBlbGXYxxng==

is-path-inside@^3.0.3:
  version "3.0.3"
  resolved "https://registry.yarnpkg.com/is-path-inside/-/is-path-inside-3.0.3.tgz#d231362e53a07ff2b0e0ea7fed049161ffd16283"
  integrity sha512-Fd4gABb+ycGAmKou8eMftCupSir5lRxqf4aD/vd0cD2qc4HL07OjCeuHMr8Ro4CoMaeCKDB0/ECBOVWjTwUvPQ==

is-regex@^1.1.4:
  version "1.1.4"
  resolved "https://registry.yarnpkg.com/is-regex/-/is-regex-1.1.4.tgz#eef5663cd59fa4c0ae339505323df6854bb15958"
  integrity sha512-kvRdxDsxZjhzUX07ZnLydzS1TU/TJlTUHHY4YLL87e37oUA49DfkLqgy+VjFocowy29cKvcSiu+kIv728jTTVg==
  dependencies:
    call-bind "^1.0.2"
    has-tostringtag "^1.0.0"

is-set@^2.0.3:
  version "2.0.3"
  resolved "https://registry.yarnpkg.com/is-set/-/is-set-2.0.3.tgz#8ab209ea424608141372ded6e0cb200ef1d9d01d"
  integrity sha512-iPAjerrse27/ygGLxw+EBR9agv9Y6uLeYVJMu+QNCoouJ1/1ri0mGrcWpfCqFZuzzx3WjtwxG098X+n4OuRkPg==

is-shared-array-buffer@^1.0.2, is-shared-array-buffer@^1.0.3:
  version "1.0.3"
  resolved "https://registry.yarnpkg.com/is-shared-array-buffer/-/is-shared-array-buffer-1.0.3.tgz#1237f1cba059cdb62431d378dcc37d9680181688"
  integrity sha512-nA2hv5XIhLR3uVzDDfCIknerhx8XUKnstuOERPNNIinXG7v9u+ohXF67vxm4TPTEPU6lm61ZkwP3c9PCB97rhg==
  dependencies:
    call-bind "^1.0.7"

is-stream@^3.0.0:
  version "3.0.0"
  resolved "https://registry.yarnpkg.com/is-stream/-/is-stream-3.0.0.tgz#e6bfd7aa6bef69f4f472ce9bb681e3e57b4319ac"
  integrity sha512-LnQR4bZ9IADDRSkvpqMGvt/tEJWclzklNgSw48V5EAaAeDd6qGvN8ei6k5p0tvxSR171VmGyHuTiAOfxAbr8kA==

is-string@^1.0.5, is-string@^1.0.7:
  version "1.0.7"
  resolved "https://registry.yarnpkg.com/is-string/-/is-string-1.0.7.tgz#0dd12bf2006f255bb58f695110eff7491eebc0fd"
  integrity sha512-tE2UXzivje6ofPW7l23cjDOMa09gb7xlAqG6jG5ej6uPV32TlWP3NKPigtaGeHNu9fohccRYvIiZMfOOnOYUtg==
  dependencies:
    has-tostringtag "^1.0.0"

is-symbol@^1.0.2, is-symbol@^1.0.3:
  version "1.0.4"
  resolved "https://registry.yarnpkg.com/is-symbol/-/is-symbol-1.0.4.tgz#a6dac93b635b063ca6872236de88910a57af139c"
  integrity sha512-C/CPBqKWnvdcxqIARxyOh4v1UUEOCHpgDa0WYgpKDFMszcrPcffg5uhwSgPCLD2WWxmq6isisz87tzT01tuGhg==
  dependencies:
    has-symbols "^1.0.2"

is-typed-array@^1.1.13:
  version "1.1.13"
  resolved "https://registry.yarnpkg.com/is-typed-array/-/is-typed-array-1.1.13.tgz#d6c5ca56df62334959322d7d7dd1cca50debe229"
  integrity sha512-uZ25/bUAlUY5fR4OKT4rZQEBrzQWYV9ZJYGGsUmEJ6thodVJ1HX64ePQ6Z0qPWP+m+Uq6e9UugrE38jeYsDSMw==
  dependencies:
    which-typed-array "^1.1.14"

is-unicode-supported@^1.1.0:
  version "1.3.0"
  resolved "https://registry.yarnpkg.com/is-unicode-supported/-/is-unicode-supported-1.3.0.tgz#d824984b616c292a2e198207d4a609983842f714"
  integrity sha512-43r2mRvz+8JRIKnWJ+3j8JtjRKZ6GmjzfaE/qiBJnikNnYv/6bagRJ1kUhNk8R5EX/GkobD+r+sfxCPJsiKBLQ==

is-weakmap@^2.0.2:
  version "2.0.2"
  resolved "https://registry.yarnpkg.com/is-weakmap/-/is-weakmap-2.0.2.tgz#bf72615d649dfe5f699079c54b83e47d1ae19cfd"
  integrity sha512-K5pXYOm9wqY1RgjpL3YTkF39tni1XajUIkawTLUo9EZEVUFga5gSQJF8nNS7ZwJQ02y+1YCNYcMh+HIf1ZqE+w==

is-weakref@^1.0.2:
  version "1.0.2"
  resolved "https://registry.yarnpkg.com/is-weakref/-/is-weakref-1.0.2.tgz#9529f383a9338205e89765e0392efc2f100f06f2"
  integrity sha512-qctsuLZmIQ0+vSSMfoVvyFe2+GSEvnmZ2ezTup1SBse9+twCCeial6EEi3Nc2KFcf6+qz2FBPnjXsk8xhKSaPQ==
  dependencies:
    call-bind "^1.0.2"

is-weakset@^2.0.3:
  version "2.0.3"
  resolved "https://registry.yarnpkg.com/is-weakset/-/is-weakset-2.0.3.tgz#e801519df8c0c43e12ff2834eead84ec9e624007"
  integrity sha512-LvIm3/KWzS9oRFHugab7d+M/GcBXuXX5xZkzPmN+NxihdQlZUQ4dWuSV1xR/sq6upL1TJEDrfBgRepHFdBtSNQ==
  dependencies:
    call-bind "^1.0.7"
    get-intrinsic "^1.2.4"

isarray@^2.0.5:
  version "2.0.5"
  resolved "https://registry.yarnpkg.com/isarray/-/isarray-2.0.5.tgz#8af1e4c1221244cc62459faf38940d4e644a5723"
  integrity sha512-xHjhDr3cNBK0BzdUJSPXZntQUx/mwMS5Rw4A7lPJ90XGAO6ISP/ePDNuo0vhqOZU+UD5JoodwCAAoZQd3FeAKw==

isexe@^2.0.0:
  version "2.0.0"
  resolved "https://registry.yarnpkg.com/isexe/-/isexe-2.0.0.tgz#e8fbf374dc556ff8947a10dcb0572d633f2cfa10"
  integrity sha512-RHxMLp9lnKHGHRng9QFhRCMbYAcVpn69smSGcq3f36xjgVVWThj4qqLbTLlq7Ssj8B+fIQ1EuCEGI2lKsyQeIw==

iterator.prototype@^1.1.3:
  version "1.1.3"
  resolved "https://registry.yarnpkg.com/iterator.prototype/-/iterator.prototype-1.1.3.tgz#016c2abe0be3bbdb8319852884f60908ac62bf9c"
  integrity sha512-FW5iMbeQ6rBGm/oKgzq2aW4KvAGpxPzYES8N4g4xNXUKpL1mclMvOe+76AcLDTvD+Ze+sOpVhgdAQEKF4L9iGQ==
  dependencies:
    define-properties "^1.2.1"
    get-intrinsic "^1.2.1"
    has-symbols "^1.0.3"
    reflect.getprototypeof "^1.0.4"
    set-function-name "^2.0.1"

jackspeak@^3.1.2:
  version "3.4.3"
  resolved "https://registry.yarnpkg.com/jackspeak/-/jackspeak-3.4.3.tgz#8833a9d89ab4acde6188942bd1c53b6390ed5a8a"
  integrity sha512-OGlZQpz2yfahA/Rd1Y8Cd9SIEsqvXkLVoSw/cgwhnhFMDbsQFeZYoJJ7bIZBS9BcamUW96asq/npPWugM+RQBw==
  dependencies:
    "@isaacs/cliui" "^8.0.2"
  optionalDependencies:
    "@pkgjs/parseargs" "^0.11.0"

jiti@^1.21.0:
  version "1.21.6"
  resolved "https://registry.yarnpkg.com/jiti/-/jiti-1.21.6.tgz#6c7f7398dd4b3142767f9a168af2f317a428d268"
  integrity sha512-2yTgeWTWzMWkHu6Jp9NKgePDaYHbntiwvYuuJLbbN9vl7DC9DvXKOB2BC3ZZ92D3cvV/aflH0osDfwpHepQ53w==

jose@^4.14.4:
  version "4.15.9"
  resolved "https://registry.yarnpkg.com/jose/-/jose-4.15.9.tgz#9b68eda29e9a0614c042fa29387196c7dd800100"
  integrity sha512-1vUQX+IdDMVPj4k8kOxgUqlcK518yluMuGZwqlr44FS1ppZB/5GWh4rZG89erpOBOJjU/OBsnCVFfapsRz6nEA==

"js-tokens@^3.0.0 || ^4.0.0":
  version "4.0.0"
  resolved "https://registry.yarnpkg.com/js-tokens/-/js-tokens-4.0.0.tgz#19203fb59991df98e3a287050d4647cdeaf32499"
  integrity sha512-RdJUflcE3cUzKiMqQgsCu06FPu9UdIJO0beYbPhHN4k6apgJtifcoCtT9bcxOpYBtpD2kCM6Sbzg4CausW/PKQ==

js-yaml@^4.1.0:
  version "4.1.0"
  resolved "https://registry.yarnpkg.com/js-yaml/-/js-yaml-4.1.0.tgz#c1fb65f8f5017901cdd2c951864ba18458a10602"
  integrity sha512-wpxZs9NoxZaJESJGIZTyDEaYpl0FKSA+FB9aJiyemKhMwkxQg63h4T1KJgUGHpTqPDNRcmmYLugrRjJlBtWvRA==
  dependencies:
    argparse "^2.0.1"

json-buffer@3.0.1:
  version "3.0.1"
  resolved "https://registry.yarnpkg.com/json-buffer/-/json-buffer-3.0.1.tgz#9338802a30d3b6605fbe0613e094008ca8c05a13"
  integrity sha512-4bV5BfR2mqfQTJm+V5tPPdf+ZpuhiIvTuAB5g8kcrXOZpTT/QwwVRWBywX1ozr6lEuPdbHxwaJlm9G6mI2sfSQ==

json-schema-traverse@^0.4.1:
  version "0.4.1"
  resolved "https://registry.yarnpkg.com/json-schema-traverse/-/json-schema-traverse-0.4.1.tgz#69f6a87d9513ab8bb8fe63bdb0979c448e684660"
  integrity sha512-xbbCH5dCYU5T8LcEhhuh7HJ88HXuW3qsI3Y0zOZFKfZEHcpWiHU/Jxzk629Brsab/mMiHQti9wMP+845RPe3Vg==

json-stable-stringify-without-jsonify@^1.0.1:
  version "1.0.1"
  resolved "https://registry.yarnpkg.com/json-stable-stringify-without-jsonify/-/json-stable-stringify-without-jsonify-1.0.1.tgz#9db7b59496ad3f3cfef30a75142d2d930ad72651"
  integrity sha512-Bdboy+l7tA3OGW6FjyFHWkP5LuByj1Tk33Ljyq0axyzdk9//JSi2u3fP1QSmd1KNwq6VOKYGlAu87CisVir6Pw==

json5@^1.0.2:
  version "1.0.2"
  resolved "https://registry.yarnpkg.com/json5/-/json5-1.0.2.tgz#63d98d60f21b313b77c4d6da18bfa69d80e1d593"
  integrity sha512-g1MWMLBiz8FKi1e4w0UyVL3w+iJceWAFBAaBnnGKOpNa5f8TLktkbre1+s6oICydWAm+HRUGTmI+//xv2hvXYA==
  dependencies:
    minimist "^1.2.0"

jsonfile@^6.0.1:
  version "6.1.0"
  resolved "https://registry.yarnpkg.com/jsonfile/-/jsonfile-6.1.0.tgz#bc55b2634793c679ec6403094eb13698a6ec0aae"
  integrity sha512-5dgndWOriYSm5cnYaJNhalLNDKOqFwyDB/rr1E9ZsGciGvKPs8R2xYGCacuf3z6K1YKDz182fd+fY3cn3pMqXQ==
  dependencies:
    universalify "^2.0.0"
  optionalDependencies:
    graceful-fs "^4.1.6"

"jsx-ast-utils@^2.4.1 || ^3.0.0", jsx-ast-utils@^3.3.5:
  version "3.3.5"
  resolved "https://registry.yarnpkg.com/jsx-ast-utils/-/jsx-ast-utils-3.3.5.tgz#4766bd05a8e2a11af222becd19e15575e52a853a"
  integrity sha512-ZZow9HBI5O6EPgSJLUb8n2NKgmVWTwCvHGwFuJlMjvLFqlGG6pjirPhtdsseaLZjSibD8eegzmYpUZwoIlj2cQ==
  dependencies:
    array-includes "^3.1.6"
    array.prototype.flat "^1.3.1"
    object.assign "^4.1.4"
    object.values "^1.1.6"

keyv@^4.5.3:
  version "4.5.4"
  resolved "https://registry.yarnpkg.com/keyv/-/keyv-4.5.4.tgz#a879a99e29452f942439f2a405e3af8b31d4de93"
  integrity sha512-oxVHkHR/EJf2CNXnWxRLW6mg7JyCCUcG0DtEGmL2ctUo1PNTin1PUil+r/+4r5MpVgC/fn1kjsx7mjSujKqIpw==
  dependencies:
    json-buffer "3.0.1"

kleur@^3.0.3:
  version "3.0.3"
  resolved "https://registry.yarnpkg.com/kleur/-/kleur-3.0.3.tgz#a79c9ecc86ee1ce3fa6206d1216c501f147fc07e"
  integrity sha512-eTIzlVOSUR+JxdDFepEYcBMtZ9Qqdef+rnzWdRZuMbOywu5tO2w2N7rqjoANZ5k9vywhL6Br1VRjUIgTQx4E8w==

language-subtag-registry@^0.3.20:
  version "0.3.23"
  resolved "https://registry.yarnpkg.com/language-subtag-registry/-/language-subtag-registry-0.3.23.tgz#23529e04d9e3b74679d70142df3fd2eb6ec572e7"
  integrity sha512-0K65Lea881pHotoGEa5gDlMxt3pctLi2RplBb7Ezh4rRdLEOtgi7n4EwK9lamnUCkKBqaeKRVebTq6BAxSkpXQ==

language-tags@^1.0.9:
  version "1.0.9"
  resolved "https://registry.yarnpkg.com/language-tags/-/language-tags-1.0.9.tgz#1ffdcd0ec0fafb4b1be7f8b11f306ad0f9c08777"
  integrity sha512-MbjN408fEndfiQXbFQ1vnd+1NoLDsnQW41410oQBXiyXDMYH5z505juWa4KUE1LqxRC7DgOgZDbKLxHIwm27hA==
  dependencies:
    language-subtag-registry "^0.3.20"

levn@^0.4.1:
  version "0.4.1"
  resolved "https://registry.yarnpkg.com/levn/-/levn-0.4.1.tgz#ae4562c007473b932a6200d403268dd2fffc6ade"
  integrity sha512-+bT2uH4E5LGE7h/n3evcS/sQlJXCpIp6ym8OWJ5eV6+67Dsql/LaaT7qJBAt2rzfoa/5QBGBhxDix1dMt2kQKQ==
  dependencies:
    prelude-ls "^1.2.1"
    type-check "~0.4.0"

lilconfig@^2.1.0:
  version "2.1.0"
  resolved "https://registry.yarnpkg.com/lilconfig/-/lilconfig-2.1.0.tgz#78e23ac89ebb7e1bfbf25b18043de756548e7f52"
  integrity sha512-utWOt/GHzuUxnLKxB6dk81RoOeoNeHgbrXiuGk4yyF5qlRz+iIVWu56E2fqGHFrXz0QNUhLB/8nKqvRH66JKGQ==

lilconfig@^3.0.0:
  version "3.1.2"
  resolved "https://registry.yarnpkg.com/lilconfig/-/lilconfig-3.1.2.tgz#e4a7c3cb549e3a606c8dcc32e5ae1005e62c05cb"
  integrity sha512-eop+wDAvpItUys0FWkHIKeC9ybYrTGbU41U5K7+bttZZeohvnY7M9dZ5kB21GNWiFT2q1OoPTvncPCgSOVO5ow==

lines-and-columns@^1.1.6:
  version "1.2.4"
  resolved "https://registry.yarnpkg.com/lines-and-columns/-/lines-and-columns-1.2.4.tgz#eca284f75d2965079309dc0ad9255abb2ebc1632"
  integrity sha512-7ylylesZQ/PV29jhEDl3Ufjo6ZX7gCqJr5F7PKrqc93v7fzSymt1BpwEU8nAUXs8qzzvqhbjhK5QZg6Mt/HkBg==

locate-path@^6.0.0:
  version "6.0.0"
  resolved "https://registry.yarnpkg.com/locate-path/-/locate-path-6.0.0.tgz#55321eb309febbc59c4801d931a72452a681d286"
  integrity sha512-iPZK6eYjbxRu3uB4/WZ3EsEIMJFMqAoopl3R+zuq0UjcAm/MO6KCweDgPfP3elTztoKP3KtnVHxTn2NHBSDVUw==
  dependencies:
    p-locate "^5.0.0"

lodash.merge@^4.6.2:
  version "4.6.2"
  resolved "https://registry.yarnpkg.com/lodash.merge/-/lodash.merge-4.6.2.tgz#558aa53b43b661e1925a0afdfa36a9a1085fe57a"
  integrity sha512-0KpjqXRVvrYyCsX1swR/XTK0va6VQkQM6MNo7PqW77ByjAhoARA8EfrP1N4+KlKj8YS0ZUCtRT/YUuhyYDujIQ==

log-symbols@^5.1.0:
  version "5.1.0"
  resolved "https://registry.yarnpkg.com/log-symbols/-/log-symbols-5.1.0.tgz#a20e3b9a5f53fac6aeb8e2bb22c07cf2c8f16d93"
  integrity sha512-l0x2DvrW294C9uDCoQe1VSU4gf529FkSZ6leBl4TiqZH/e+0R7hSfHQBNut2mNygDgHwvYHfFLn6Oxb3VWj2rA==
  dependencies:
    chalk "^5.0.0"
    is-unicode-supported "^1.1.0"

loose-envify@^1.0.0, loose-envify@^1.4.0:
  version "1.4.0"
  resolved "https://registry.yarnpkg.com/loose-envify/-/loose-envify-1.4.0.tgz#71ee51fa7be4caec1a63839f7e682d8132d30caf"
  integrity sha512-lyuxPGr/Wfhrlem2CL/UcnUc1zcqKAImBDzukY7Y5F/yQiNdko6+fRLevlw1HgMySw7f611UIY408EtxRSoK3Q==
  dependencies:
    js-tokens "^3.0.0 || ^4.0.0"

lru-cache@^10.2.0:
  version "10.4.3"
  resolved "https://registry.yarnpkg.com/lru-cache/-/lru-cache-10.4.3.tgz#410fc8a17b70e598013df257c2446b7f3383f119"
  integrity sha512-JNAzZcXrCt42VGLuYz0zfAzDfAvJWW6AfYlDBQyDV5DClI2m5sAmK+OIO7s59XfsRsWHp02jAJrRadPRGTt6SQ==

lucide-react@^0.454.0:
  version "0.454.0"
  resolved "https://registry.yarnpkg.com/lucide-react/-/lucide-react-0.454.0.tgz#a81b9c482018720f07ead0503ae502d94d528444"
  integrity sha512-hw7zMDwykCLnEzgncEEjHeA6+45aeEzRYuKHuyRSOPkhko+J3ySGjGIzu+mmMfDFG1vazHepMaYFYHbTFAZAAQ==

merge-stream@^2.0.0:
  version "2.0.0"
  resolved "https://registry.yarnpkg.com/merge-stream/-/merge-stream-2.0.0.tgz#52823629a14dd00c9770fb6ad47dc6310f2c1f60"
  integrity sha512-abv/qOcuPfk3URPfDzmZU1LKmuw8kT+0nIHvKrKgFrwifol/doWcdA4ZqsWQ8ENrFKkd67Mfpo/LovbIUsbt3w==

merge2@^1.3.0:
  version "1.4.1"
  resolved "https://registry.yarnpkg.com/merge2/-/merge2-1.4.1.tgz#4368892f885e907455a6fd7dc55c0c9d404990ae"
  integrity sha512-8q7VEgMJW4J8tcfVPy8g09NcQwZdbwFEqhe/WZkoIzjn/3TGDwtOCYtXGxA3O8tPzpczCCDgv+P2P5y00ZJOOg==

micromatch@^4.0.4, micromatch@^4.0.5:
  version "4.0.8"
  resolved "https://registry.yarnpkg.com/micromatch/-/micromatch-4.0.8.tgz#d66fa18f3a47076789320b9b1af32bd86d9fa202"
  integrity sha512-PXwfBhYu0hBCPw8Dn0E+WDYb7af3dSLVWKi3HGv84IdF4TyFoC0ysxFd0Goxw7nSv4T/PzEJQxsYsEiFCKo2BA==
  dependencies:
    braces "^3.0.3"
    picomatch "^2.3.1"

mimic-fn@^2.1.0:
  version "2.1.0"
  resolved "https://registry.yarnpkg.com/mimic-fn/-/mimic-fn-2.1.0.tgz#7ed2c2ccccaf84d3ffcb7a69b57711fc2083401b"
  integrity sha512-OqbOk5oEQeAZ8WXWydlu9HJjz9WVdEIvamMCcXmuqUYjTknH/sqsWvhQ3vgwKFRR1HpjvNBKQ37nbJgYzGqGcg==

mimic-fn@^4.0.0:
  version "4.0.0"
  resolved "https://registry.yarnpkg.com/mimic-fn/-/mimic-fn-4.0.0.tgz#60a90550d5cb0b239cca65d893b1a53b29871ecc"
  integrity sha512-vqiC06CuhBTUdZH+RYl8sFrL096vA45Ok5ISO6sE/Mr1jRbGH4Csnhi8f3wKVl7x8mO4Au7Ir9D3Oyv1VYMFJw==

minimatch@^3.0.5, minimatch@^3.1.1, minimatch@^3.1.2:
  version "3.1.2"
  resolved "https://registry.yarnpkg.com/minimatch/-/minimatch-3.1.2.tgz#19cd194bfd3e428f049a70817c038d89ab4be35b"
  integrity sha512-J7p63hRiAjw1NDEww1W7i37+ByIrOWO5XQQAzZ3VOcL0PNybwpfmV/N05zFAzwQ9USyEcX6t3UO+K5aqBQOIHw==
  dependencies:
    brace-expansion "^1.1.7"

minimatch@^9.0.4:
  version "9.0.5"
  resolved "https://registry.yarnpkg.com/minimatch/-/minimatch-9.0.5.tgz#d74f9dd6b57d83d8e98cfb82133b03978bc929e5"
  integrity sha512-G6T0ZX48xgozx7587koeX9Ys2NYy6Gmv//P89sEte9V9whIapMNF4idKxnW2QtCcLiTWlb/wfCabAtAFWhhBow==
  dependencies:
    brace-expansion "^2.0.1"

minimist@^1.2.0, minimist@^1.2.6:
  version "1.2.8"
  resolved "https://registry.yarnpkg.com/minimist/-/minimist-1.2.8.tgz#c1a464e7693302e082a075cee0c057741ac4772c"
  integrity sha512-2yyAR8qBkN3YuheJanUpWC5U3bb5osDywNB8RzDVlDwDHbocAJveqqj1u8+SVD7jkWT4yvsHCpWqqWqAxb0zCA==

"minipass@^5.0.0 || ^6.0.2 || ^7.0.0", minipass@^7.1.2:
  version "7.1.2"
  resolved "https://registry.yarnpkg.com/minipass/-/minipass-7.1.2.tgz#93a9626ce5e5e66bd4db86849e7515e92340a707"
  integrity sha512-qOOzS1cBTWYF4BH8fVePDBOO9iptMnGUEZwNc/cMWnTV2nVLZ7VoNWEPHkYczZA0pdoA7dl6e7FL659nX9S2aw==

ms@^2.1.1, ms@^2.1.3:
  version "2.1.3"
  resolved "https://registry.yarnpkg.com/ms/-/ms-2.1.3.tgz#574c8138ce1d2b5861f0b44579dbadd60c6615b2"
  integrity sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==

mz@^2.7.0:
  version "2.7.0"
  resolved "https://registry.yarnpkg.com/mz/-/mz-2.7.0.tgz#95008057a56cafadc2bc63dde7f9ff6955948e32"
  integrity sha512-z81GNO7nnYMEhrGh9LeymoE4+Yr0Wn5McHIZMK5cfQCl+NDX08sCZgUc9/6MHni9IWuFLm1Z3HTCXu2z9fN62Q==
  dependencies:
    any-promise "^1.0.0"
    object-assign "^4.0.1"
    thenify-all "^1.0.0"

nanoid@^3.3.6, nanoid@^3.3.7:
  version "3.3.7"
  resolved "https://registry.yarnpkg.com/nanoid/-/nanoid-3.3.7.tgz#d0c301a691bc8d54efa0a2226ccf3fe2fd656bd8"
  integrity sha512-eSRppjcPIatRIMC1U6UngP8XFcz8MQWGQdt1MTBQ7NaAmvXDfvNxbvWV3x2y6CdEUciCSsDHDQZbhYaB8QEo2g==

natural-compare@^1.4.0:
  version "1.4.0"
  resolved "https://registry.yarnpkg.com/natural-compare/-/natural-compare-1.4.0.tgz#4abebfeed7541f2c27acfb29bdbbd15c8d5ba4f7"
  integrity sha512-OWND8ei3VtNC9h7V60qff3SVobHr996CTwgxubgyQYEpg290h9J0buyECNNJexkFm5sOajh5G116RYA1c8ZMSw==

next@15.0.3:
  version "15.0.3"
  resolved "https://registry.yarnpkg.com/next/-/next-15.0.3.tgz#804f5b772e7570ef1f088542a59860914d3288e9"
  integrity sha512-ontCbCRKJUIoivAdGB34yCaOcPgYXr9AAkV/IwqFfWWTXEPUgLYkSkqBhIk9KK7gGmgjc64B+RdoeIDM13Irnw==
  dependencies:
    "@next/env" "15.0.3"
    "@swc/counter" "0.1.3"
    "@swc/helpers" "0.5.13"
    busboy "1.6.0"
    caniuse-lite "^1.0.30001579"
    postcss "8.4.31"
    styled-jsx "5.1.6"
  optionalDependencies:
    "@next/swc-darwin-arm64" "15.0.3"
    "@next/swc-darwin-x64" "15.0.3"
    "@next/swc-linux-arm64-gnu" "15.0.3"
    "@next/swc-linux-arm64-musl" "15.0.3"
    "@next/swc-linux-x64-gnu" "15.0.3"
    "@next/swc-linux-x64-musl" "15.0.3"
    "@next/swc-win32-arm64-msvc" "15.0.3"
    "@next/swc-win32-x64-msvc" "15.0.3"
    sharp "^0.33.5"

node-domexception@^1.0.0:
  version "1.0.0"
  resolved "https://registry.yarnpkg.com/node-domexception/-/node-domexception-1.0.0.tgz#6888db46a1f71c0b76b3f7555016b63fe64766e5"
  integrity sha512-/jKZoMpw0F8GRwl4/eLROPA3cfcXtLApP0QzLmUT/HuPCZWyB7IY9ZrMeKw2O/nFIqPQB3PVM9aYm0F312AXDQ==

node-fetch@^3.3.0:
  version "3.3.2"
  resolved "https://registry.yarnpkg.com/node-fetch/-/node-fetch-3.3.2.tgz#d1e889bacdf733b4ff3b2b243eb7a12866a0b78b"
  integrity sha512-dRB78srN/l6gqWulah9SrxeYnxeddIG30+GOqK/9OlLVyLg3HPnr6SqOWTWOXKRwC2eGYCkZ59NNuSgvSrpgOA==
  dependencies:
    data-uri-to-buffer "^4.0.0"
    fetch-blob "^3.1.4"
    formdata-polyfill "^4.0.10"

node-releases@^2.0.18:
  version "2.0.18"
  resolved "https://registry.yarnpkg.com/node-releases/-/node-releases-2.0.18.tgz#f010e8d35e2fe8d6b2944f03f70213ecedc4ca3f"
  integrity sha512-d9VeXT4SJ7ZeOqGX6R5EM022wpL+eWPooLI+5UpWn2jCT1aosUQEhQP214x33Wkwx3JQMvIm+tIoVOdodFS40g==

normalize-path@^3.0.0, normalize-path@~3.0.0:
  version "3.0.0"
  resolved "https://registry.yarnpkg.com/normalize-path/-/normalize-path-3.0.0.tgz#0dcd69ff23a1c9b11fd0978316644a0388216a65"
  integrity sha512-6eZs5Ls3WtCisHWp9S2GUy8dqkpGi4BVSz3GaqiE6ezub0512ESztXUwUB6C6IKbQkY2Pnb/mD4WYojCRwcwLA==

normalize-range@^0.1.2:
  version "0.1.2"
  resolved "https://registry.yarnpkg.com/normalize-range/-/normalize-range-0.1.2.tgz#2d10c06bdfd312ea9777695a4d28439456b75942"
  integrity sha512-bdok/XvKII3nUpklnV6P2hxtMNrCboOjAcyBuQnWEhO665FwrSNRxU+AqpsyvO6LgGYPspN+lu5CLtw4jPRKNA==

npm-run-path@^5.1.0:
  version "5.3.0"
  resolved "https://registry.yarnpkg.com/npm-run-path/-/npm-run-path-5.3.0.tgz#e23353d0ebb9317f174e93417e4a4d82d0249e9f"
  integrity sha512-ppwTtiJZq0O/ai0z7yfudtBpWIoxM8yE6nHi1X47eFR2EWORqfbu6CnPlNsjeN683eT0qG6H/Pyf9fCcvjnnnQ==
  dependencies:
    path-key "^4.0.0"

object-assign@^4.0.1, object-assign@^4.1.1:
  version "4.1.1"
  resolved "https://registry.yarnpkg.com/object-assign/-/object-assign-4.1.1.tgz#2109adc7965887cfc05cbbd442cac8bfbb360863"
  integrity sha512-rJgTQnkUnH1sFw8yT6VSU3zD3sWmu6sZhIseY8VX+GRu3P6F7Fu+JNDoXfklElbLJSnc3FUQHVe4cU5hj+BcUg==

object-hash@^3.0.0:
  version "3.0.0"
  resolved "https://registry.yarnpkg.com/object-hash/-/object-hash-3.0.0.tgz#73f97f753e7baffc0e2cc9d6e079079744ac82e9"
  integrity sha512-RSn9F68PjH9HqtltsSnqYC1XXoWe9Bju5+213R98cNGttag9q9yAOTzdbsqvIa7aNm5WffBZFpWYr2aWrklWAw==

object-inspect@^1.13.1:
  version "1.13.2"
  resolved "https://registry.yarnpkg.com/object-inspect/-/object-inspect-1.13.2.tgz#dea0088467fb991e67af4058147a24824a3043ff"
  integrity sha512-IRZSRuzJiynemAXPYtPe5BoI/RESNYR7TYm50MC5Mqbd3Jmw5y790sErYw3V6SryFJD64b74qQQs9wn5Bg/k3g==

object-keys@^1.1.1:
  version "1.1.1"
  resolved "https://registry.yarnpkg.com/object-keys/-/object-keys-1.1.1.tgz#1c47f272df277f3b1daf061677d9c82e2322c60e"
  integrity sha512-NuAESUOUMrlIXOfHKzD6bpPu3tYt3xvjNdRIQ+FeT0lNb4K8WR70CaDxhuNguS2XG+GjkyMwOzsN5ZktImfhLA==

object.assign@^4.1.4, object.assign@^4.1.5:
  version "4.1.5"
  resolved "https://registry.yarnpkg.com/object.assign/-/object.assign-4.1.5.tgz#3a833f9ab7fdb80fc9e8d2300c803d216d8fdbb0"
  integrity sha512-byy+U7gp+FVwmyzKPYhW2h5l3crpmGsxl7X2s8y43IgxvG4g3QZ6CffDtsNQy1WsmZpQbO+ybo0AlW7TY6DcBQ==
  dependencies:
    call-bind "^1.0.5"
    define-properties "^1.2.1"
    has-symbols "^1.0.3"
    object-keys "^1.1.1"

object.entries@^1.1.8:
  version "1.1.8"
  resolved "https://registry.yarnpkg.com/object.entries/-/object.entries-1.1.8.tgz#bffe6f282e01f4d17807204a24f8edd823599c41"
  integrity sha512-cmopxi8VwRIAw/fkijJohSfpef5PdN0pMQJN6VC/ZKvn0LIknWD8KtgY6KlQdEc4tIjcQ3HxSMmnvtzIscdaYQ==
  dependencies:
    call-bind "^1.0.7"
    define-properties "^1.2.1"
    es-object-atoms "^1.0.0"

object.fromentries@^2.0.8:
  version "2.0.8"
  resolved "https://registry.yarnpkg.com/object.fromentries/-/object.fromentries-2.0.8.tgz#f7195d8a9b97bd95cbc1999ea939ecd1a2b00c65"
  integrity sha512-k6E21FzySsSK5a21KRADBd/NGneRegFO5pLHfdQLpRDETUNJueLXs3WCzyQ3tFRDYgbq3KHGXfTbi2bs8WQ6rQ==
  dependencies:
    call-bind "^1.0.7"
    define-properties "^1.2.1"
    es-abstract "^1.23.2"
    es-object-atoms "^1.0.0"

object.groupby@^1.0.3:
  version "1.0.3"
  resolved "https://registry.yarnpkg.com/object.groupby/-/object.groupby-1.0.3.tgz#9b125c36238129f6f7b61954a1e7176148d5002e"
  integrity sha512-+Lhy3TQTuzXI5hevh8sBGqbmurHbbIjAi0Z4S63nthVLmLxfbj4T54a4CfZrXIrt9iP4mVAPYMo/v99taj3wjQ==
  dependencies:
    call-bind "^1.0.7"
    define-properties "^1.2.1"
    es-abstract "^1.23.2"

object.values@^1.1.6, object.values@^1.2.0:
  version "1.2.0"
  resolved "https://registry.yarnpkg.com/object.values/-/object.values-1.2.0.tgz#65405a9d92cee68ac2d303002e0b8470a4d9ab1b"
  integrity sha512-yBYjY9QX2hnRmZHAjG/f13MzmBzxzYgQhFrke06TTyKY5zSTEqkOeukBzIdVA3j3ulu8Qa3MbVFShV7T2RmGtQ==
  dependencies:
    call-bind "^1.0.7"
    define-properties "^1.2.1"
    es-object-atoms "^1.0.0"

once@^1.3.0:
  version "1.4.0"
  resolved "https://registry.yarnpkg.com/once/-/once-1.4.0.tgz#583b1aa775961d4b113ac17d9c50baef9dd76bd1"
  integrity sha512-lNaJgI+2Q5URQBkccEKHTQOPaXdUxnZZElQTZY0MFUAuaEqe1E+Nyvgdz/aIyNi6Z9MzO5dv1H8n58/GELp3+w==
  dependencies:
    wrappy "1"

onetime@^5.1.0:
  version "5.1.2"
  resolved "https://registry.yarnpkg.com/onetime/-/onetime-5.1.2.tgz#d0e96ebb56b07476df1dd9c4806e5237985ca45e"
  integrity sha512-kbpaSSGJTWdAY5KPVeMOKXSrPtr8C8C7wodJbcsd51jRnmD+GZu8Y0VoU6Dm5Z4vWr0Ig/1NKuWRKf7j5aaYSg==
  dependencies:
    mimic-fn "^2.1.0"

onetime@^6.0.0:
  version "6.0.0"
  resolved "https://registry.yarnpkg.com/onetime/-/onetime-6.0.0.tgz#7c24c18ed1fd2e9bca4bd26806a33613c77d34b4"
  integrity sha512-1FlR+gjXK7X+AsAHso35MnyN5KqGwJRi/31ft6x0M194ht7S+rWAvd7PHss9xSKMzE0asv1pyIHaJYq+BbacAQ==
  dependencies:
    mimic-fn "^4.0.0"

optionator@^0.9.3:
  version "0.9.4"
  resolved "https://registry.yarnpkg.com/optionator/-/optionator-0.9.4.tgz#7ea1c1a5d91d764fb282139c88fe11e182a3a734"
  integrity sha512-6IpQ7mKUxRcZNLIObR0hz7lxsapSSIYNZJwXPGeF0mTVqGKFIXj1DQcMoT22S3ROcLyY/rz0PWaWZ9ayWmad9g==
  dependencies:
    deep-is "^0.1.3"
    fast-levenshtein "^2.0.6"
    levn "^0.4.1"
    prelude-ls "^1.2.1"
    type-check "^0.4.0"
    word-wrap "^1.2.5"

ora@^6.1.2:
  version "6.3.1"
  resolved "https://registry.yarnpkg.com/ora/-/ora-6.3.1.tgz#a4e9e5c2cf5ee73c259e8b410273e706a2ad3ed6"
  integrity sha512-ERAyNnZOfqM+Ao3RAvIXkYh5joP220yf59gVe2X/cI6SiCxIdi4c9HZKZD8R6q/RDXEje1THBju6iExiSsgJaQ==
  dependencies:
    chalk "^5.0.0"
    cli-cursor "^4.0.0"
    cli-spinners "^2.6.1"
    is-interactive "^2.0.0"
    is-unicode-supported "^1.1.0"
    log-symbols "^5.1.0"
    stdin-discarder "^0.1.0"
    strip-ansi "^7.0.1"
    wcwidth "^1.0.1"

p-limit@^3.0.2:
  version "3.1.0"
  resolved "https://registry.yarnpkg.com/p-limit/-/p-limit-3.1.0.tgz#e1daccbe78d0d1388ca18c64fea38e3e57e3706b"
  integrity sha512-TYOanM3wGwNGsZN2cVTYPArw454xnXj5qmWF1bEoAc4+cU/ol7GVh7odevjp1FNHduHc3KZMcFduxU5Xc6uJRQ==
  dependencies:
    yocto-queue "^0.1.0"

p-locate@^5.0.0:
  version "5.0.0"
  resolved "https://registry.yarnpkg.com/p-locate/-/p-locate-5.0.0.tgz#83c8315c6785005e3bd021839411c9e110e6d834"
  integrity sha512-LaNjtRWUBY++zB5nE/NwcaoMylSPk+S+ZHNB1TzdbMJMny6dynpAGt7X/tl/QYq3TIeE6nxHppbo2LGymrG5Pw==
  dependencies:
    p-limit "^3.0.2"

package-json-from-dist@^1.0.0:
  version "1.0.1"
  resolved "https://registry.yarnpkg.com/package-json-from-dist/-/package-json-from-dist-1.0.1.tgz#4f1471a010827a86f94cfd9b0727e36d267de505"
  integrity sha512-UEZIS3/by4OC8vL3P2dTXRETpebLI2NiI5vIrjaD/5UtrkFX/tNbwjTSRAGC/+7CAo2pIcBaRgWmcBBHcsaCIw==

parent-module@^1.0.0:
  version "1.0.1"
  resolved "https://registry.yarnpkg.com/parent-module/-/parent-module-1.0.1.tgz#691d2709e78c79fae3a156622452d00762caaaa2"
  integrity sha512-GQ2EWRpQV8/o+Aw8YqtfZZPfNRWZYkbidE9k5rpl/hC3vtHHBfGm2Ifi6qWV+coDGkrUKZAxE3Lot5kcsRlh+g==
  dependencies:
    callsites "^3.0.0"

path-exists@^4.0.0:
  version "4.0.0"
  resolved "https://registry.yarnpkg.com/path-exists/-/path-exists-4.0.0.tgz#513bdbe2d3b95d7762e8c1137efa195c6c61b5b3"
  integrity sha512-ak9Qy5Q7jYb2Wwcey5Fpvg2KoAc/ZIhLSLOSBmRmygPsGwkVVt0fZa0qrtMz+m6tJTAHfZQ8FnmB4MG4LWy7/w==

path-is-absolute@^1.0.0:
  version "1.0.1"
  resolved "https://registry.yarnpkg.com/path-is-absolute/-/path-is-absolute-1.0.1.tgz#174b9268735534ffbc7ace6bf53a5a9e1b5c5f5f"
  integrity sha512-AVbw3UJ2e9bq64vSaS9Am0fje1Pa8pbGqTTsmXfaIiMpnr5DlDhfJOuLj9Sf95ZPVDAUerDfEk88MPmPe7UCQg==

path-key@^3.1.0:
  version "3.1.1"
  resolved "https://registry.yarnpkg.com/path-key/-/path-key-3.1.1.tgz#581f6ade658cbba65a0d3380de7753295054f375"
  integrity sha512-ojmeN0qd+y0jszEtoY48r0Peq5dwMEkIlCOu6Q5f41lfkswXuKtYrhgoTpLnyIcHm24Uhqx+5Tqm2InSwLhE6Q==

path-key@^4.0.0:
  version "4.0.0"
  resolved "https://registry.yarnpkg.com/path-key/-/path-key-4.0.0.tgz#295588dc3aee64154f877adb9d780b81c554bf18"
  integrity sha512-haREypq7xkM7ErfgIyA0z+Bj4AGKlMSdlQE2jvJo6huWD1EdkKYV+G/T4nq0YEF2vgTT8kqMFKo1uHn950r4SQ==

path-parse@^1.0.7:
  version "1.0.7"
  resolved "https://registry.yarnpkg.com/path-parse/-/path-parse-1.0.7.tgz#fbc114b60ca42b30d9daf5858e4bd68bbedb6735"
  integrity sha512-LDJzPVEEEPR+y48z93A0Ed0yXb8pAByGWo/k5YYdYgpY2/2EsOsksJrq7lOHxryrVOn1ejG6oAp8ahvOIQD8sw==

path-scurry@^1.11.1:
  version "1.11.1"
  resolved "https://registry.yarnpkg.com/path-scurry/-/path-scurry-1.11.1.tgz#7960a668888594a0720b12a911d1a742ab9f11d2"
  integrity sha512-Xa4Nw17FS9ApQFJ9umLiJS4orGjm7ZzwUrwamcGQuHSzDyth9boKDaycYdDcZDuqYATXw4HFXgaqWTctW/v1HA==
  dependencies:
    lru-cache "^10.2.0"
    minipass "^5.0.0 || ^6.0.2 || ^7.0.0"

picocolors@^1.0.0, picocolors@^1.0.1, picocolors@^1.1.0:
  version "1.1.1"
  resolved "https://registry.yarnpkg.com/picocolors/-/picocolors-1.1.1.tgz#3d321af3eab939b083c8f929a1d12cda81c26b6b"
  integrity sha512-xceH2snhtb5M9liqDsmEw56le376mTZkEX/jEb/RxNFyegNul7eNslCXP9FDj/Lcu0X8KEyMceP2ntpaHrDEVA==

picomatch@^2.0.4, picomatch@^2.2.1, picomatch@^2.3.1:
  version "2.3.1"
  resolved "https://registry.yarnpkg.com/picomatch/-/picomatch-2.3.1.tgz#3ba3833733646d9d3e4995946c1365a67fb07a42"
  integrity sha512-JU3teHTNjmE2VCGFzuY8EXzCDVwEqB2a8fsIvwaStHhAWJEeVd1o1QD80CU6+ZdEXXSLbSsuLwJjkCBWqRQUVA==

pify@^2.3.0:
  version "2.3.0"
  resolved "https://registry.yarnpkg.com/pify/-/pify-2.3.0.tgz#ed141a6ac043a849ea588498e7dca8b15330e90c"
  integrity sha512-udgsAY+fTnvv7kI7aaxbqwWNb0AHiB0qBO89PZKPkoTmGOgdbrHDKD+0B2X4uTfJ/FT1R09r9gTsjUjNJotuog==

pirates@^4.0.1:
  version "4.0.6"
  resolved "https://registry.yarnpkg.com/pirates/-/pirates-4.0.6.tgz#3018ae32ecfcff6c29ba2267cbf21166ac1f36b9"
  integrity sha512-saLsH7WeYYPiD25LDuLRRY/i+6HaPYr6G1OUlN39otzkSTxKnubR9RTxS3/Kk50s1g2JTgFwWQDQyplC5/SHZg==

possible-typed-array-names@^1.0.0:
  version "1.0.0"
  resolved "https://registry.yarnpkg.com/possible-typed-array-names/-/possible-typed-array-names-1.0.0.tgz#89bb63c6fada2c3e90adc4a647beeeb39cc7bf8f"
  integrity sha512-d7Uw+eZoloe0EHDIYoe+bQ5WXnGMOpmiZFTuMWCwpjzzkL2nTjcKiAk4hh8TjnGye2TwWOk3UXucZ+3rbmBa8Q==

postcss-import@^15.1.0:
  version "15.1.0"
  resolved "https://registry.yarnpkg.com/postcss-import/-/postcss-import-15.1.0.tgz#41c64ed8cc0e23735a9698b3249ffdbf704adc70"
  integrity sha512-hpr+J05B2FVYUAXHeK1YyI267J/dDDhMU6B6civm8hSY1jYJnBXxzKDKDswzJmtLHryrjhnDjqqp/49t8FALew==
  dependencies:
    postcss-value-parser "^4.0.0"
    read-cache "^1.0.0"
    resolve "^1.1.7"

postcss-js@^4.0.1:
  version "4.0.1"
  resolved "https://registry.yarnpkg.com/postcss-js/-/postcss-js-4.0.1.tgz#61598186f3703bab052f1c4f7d805f3991bee9d2"
  integrity sha512-dDLF8pEO191hJMtlHFPRa8xsizHaM82MLfNkUHdUtVEV3tgTp5oj+8qbEqYM57SLfc74KSbw//4SeJma2LRVIw==
  dependencies:
    camelcase-css "^2.0.1"

postcss-load-config@^4.0.1:
  version "4.0.2"
  resolved "https://registry.yarnpkg.com/postcss-load-config/-/postcss-load-config-4.0.2.tgz#7159dcf626118d33e299f485d6afe4aff7c4a3e3"
  integrity sha512-bSVhyJGL00wMVoPUzAVAnbEoWyqRxkjv64tUl427SKnPrENtq6hJwUojroMz2VB+Q1edmi4IfrAPpami5VVgMQ==
  dependencies:
    lilconfig "^3.0.0"
    yaml "^2.3.4"

postcss-nested@^6.0.1:
  version "6.2.0"
  resolved "https://registry.yarnpkg.com/postcss-nested/-/postcss-nested-6.2.0.tgz#4c2d22ab5f20b9cb61e2c5c5915950784d068131"
  integrity sha512-HQbt28KulC5AJzG+cZtj9kvKB93CFCdLvog1WFLf1D+xmMvPGlBstkpTEZfK5+AN9hfJocyBFCNiqyS48bpgzQ==
  dependencies:
    postcss-selector-parser "^6.1.1"

postcss-selector-parser@^6.0.11, postcss-selector-parser@^6.1.1:
  version "6.1.2"
  resolved "https://registry.yarnpkg.com/postcss-selector-parser/-/postcss-selector-parser-6.1.2.tgz#27ecb41fb0e3b6ba7a1ec84fff347f734c7929de"
  integrity sha512-Q8qQfPiZ+THO/3ZrOrO0cJJKfpYCagtMUkXbnEfmgUjwXg6z/WBeOyS9APBBPCTSiDV+s4SwQGu8yFsiMRIudg==
  dependencies:
    cssesc "^3.0.0"
    util-deprecate "^1.0.2"

postcss-value-parser@^4.0.0, postcss-value-parser@^4.2.0:
  version "4.2.0"
  resolved "https://registry.yarnpkg.com/postcss-value-parser/-/postcss-value-parser-4.2.0.tgz#723c09920836ba6d3e5af019f92bc0971c02e514"
  integrity sha512-1NNCs6uurfkVbeXG4S8JFT9t19m45ICnif8zWLd5oPSZ50QnwMfK+H3jv408d4jw/7Bttv5axS5IiHoLaVNHeQ==

postcss@8.4.31:
  version "8.4.31"
  resolved "https://registry.yarnpkg.com/postcss/-/postcss-8.4.31.tgz#92b451050a9f914da6755af352bdc0192508656d"
  integrity sha512-PS08Iboia9mts/2ygV3eLpY5ghnUcfLV/EXTOW1E2qYxJKGGBUtNjN76FYHnMs36RmARn41bC0AZmn+rR0OVpQ==
  dependencies:
    nanoid "^3.3.6"
    picocolors "^1.0.0"
    source-map-js "^1.0.2"

postcss@^8.4.23, postcss@^8.4.47:
  version "8.4.47"
  resolved "https://registry.yarnpkg.com/postcss/-/postcss-8.4.47.tgz#5bf6c9a010f3e724c503bf03ef7947dcb0fea365"
  integrity sha512-56rxCq7G/XfB4EkXq9Egn5GCqugWvDFjafDOThIdMBsI15iqPqR5r15TfSr1YPYeEI19YeaXMCbY6u88Y76GLQ==
  dependencies:
    nanoid "^3.3.7"
    picocolors "^1.1.0"
    source-map-js "^1.2.1"

prelude-ls@^1.2.1:
  version "1.2.1"
  resolved "https://registry.yarnpkg.com/prelude-ls/-/prelude-ls-1.2.1.tgz#debc6489d7a6e6b0e7611888cec880337d316396"
  integrity sha512-vkcDPrRZo1QZLbn5RLGPpg/WmIQ65qoWWhcGKf/b5eplkkarX0m9z8ppCat4mlOqUsWpyNuYgO3VRyrYHSzX5g==

prettier-plugin-tailwindcss@^0.6.8:
  version "0.6.8"
  resolved "https://registry.yarnpkg.com/prettier-plugin-tailwindcss/-/prettier-plugin-tailwindcss-0.6.8.tgz#8a178e1679e3f941cc9de396f109c6cffea676d8"
  integrity sha512-dGu3kdm7SXPkiW4nzeWKCl3uoImdd5CTZEJGxyypEPL37Wj0HT2pLqjrvSei1nTeuQfO4PUfjeW5cTUNRLZ4sA==

prettier@^3.3.3:
  version "3.3.3"
  resolved "https://registry.yarnpkg.com/prettier/-/prettier-3.3.3.tgz#30c54fe0be0d8d12e6ae61dbb10109ea00d53105"
  integrity sha512-i2tDNA0O5IrMO757lfrdQZCc2jPNDVntV0m/+4whiDfWaTKfMNgR7Qz0NAeGz/nRqF4m5/6CLzbP4/liHt12Ew==

prompts@^2.4.2:
  version "2.4.2"
  resolved "https://registry.yarnpkg.com/prompts/-/prompts-2.4.2.tgz#7b57e73b3a48029ad10ebd44f74b01722a4cb069"
  integrity sha512-NxNv/kLguCA7p3jE8oL2aEBsrJWgAakBpgmgK6lpPWV+WuOmY6r2/zbAVnP+T8bQlA0nzHXSJSJW0Hq7ylaD2Q==
  dependencies:
    kleur "^3.0.3"
    sisteransi "^1.0.5"

prop-types@^15.8.1:
  version "15.8.1"
  resolved "https://registry.yarnpkg.com/prop-types/-/prop-types-15.8.1.tgz#67d87bf1a694f48435cf332c24af10214a3140b5"
  integrity sha512-oj87CgZICdulUohogVAR7AjlC0327U4el4L6eAvOqCeudMDVU0NThNaV+b9Df4dXgSP1gXMTnPdhfe/2qDH5cg==
  dependencies:
    loose-envify "^1.4.0"
    object-assign "^4.1.1"
    react-is "^16.13.1"

punycode@^2.1.0:
  version "2.3.1"
  resolved "https://registry.yarnpkg.com/punycode/-/punycode-2.3.1.tgz#027422e2faec0b25e1549c3e1bd8309b9133b6e5"
  integrity sha512-vYt7UD1U9Wg6138shLtLOvdAu+8DsC/ilFtEVHcH+wydcSpNE20AfSOduf6MkRFahL5FY7X1oU7nKVZFtfq8Fg==

queue-microtask@^1.2.2:
  version "1.2.3"
  resolved "https://registry.yarnpkg.com/queue-microtask/-/queue-microtask-1.2.3.tgz#4929228bbc724dfac43e0efb058caf7b6cfb6243"
  integrity sha512-NuaNSa6flKT5JaSYQzJok04JzTL1CA6aGhv5rfLW3PgqA+M2ChpZQnAC8h8i4ZFkBS8X5RqkDBHA7r4hej3K9A==

react-dom@19.0.0-rc-66855b96-20241106:
  version "19.0.0-rc-66855b96-20241106"
  resolved "https://registry.yarnpkg.com/react-dom/-/react-dom-19.0.0-rc-66855b96-20241106.tgz#beba73decfd1b9365a3c83673a298623b15acb0b"
  integrity sha512-D25vdaytZ1wFIRiwNU98NPQ/upS2P8Co4/oNoa02PzHbh8deWdepjm5qwZM/46OdSiGv4WSWwxP55RO9obqJEQ==
  dependencies:
    scheduler "0.25.0-rc-66855b96-20241106"

react-hook-form@^7.53.1:
  version "7.53.1"
  resolved "https://registry.yarnpkg.com/react-hook-form/-/react-hook-form-7.53.1.tgz#3f2cd1ed2b3af99416a4ac674da2d526625add67"
  integrity sha512-6aiQeBda4zjcuaugWvim9WsGqisoUk+etmFEsSUMm451/Ic8L/UAb7sRtMj3V+Hdzm6mMjU1VhiSzYUZeBm0Vg==

react-is@^16.13.1:
  version "16.13.1"
  resolved "https://registry.yarnpkg.com/react-is/-/react-is-16.13.1.tgz#789729a4dc36de2999dc156dd6c1d9c18cea56a4"
  integrity sha512-24e6ynE2H+OKt4kqsOvNd8kBpV65zoxbA4BVsEOB3ARVWQki/DHzaUoC5KuON/BiccDaCCTZBuOcfZs70kR8bQ==

react-remove-scroll-bar@^2.3.6:
  version "2.3.6"
  resolved "https://registry.yarnpkg.com/react-remove-scroll-bar/-/react-remove-scroll-bar-2.3.6.tgz#3e585e9d163be84a010180b18721e851ac81a29c"
  integrity sha512-DtSYaao4mBmX+HDo5YWYdBWQwYIQQshUV/dVxFxK+KM26Wjwp1gZ6rv6OC3oujI6Bfu6Xyg3TwK533AQutsn/g==
  dependencies:
    react-style-singleton "^2.2.1"
    tslib "^2.0.0"

react-remove-scroll@2.6.0:
  version "2.6.0"
  resolved "https://registry.yarnpkg.com/react-remove-scroll/-/react-remove-scroll-2.6.0.tgz#fb03a0845d7768a4f1519a99fdb84983b793dc07"
  integrity sha512-I2U4JVEsQenxDAKaVa3VZ/JeJZe0/2DxPWL8Tj8yLKctQJQiZM52pn/GWFpSp8dftjM3pSAHVJZscAnC/y+ySQ==
  dependencies:
    react-remove-scroll-bar "^2.3.6"
    react-style-singleton "^2.2.1"
    tslib "^2.1.0"
    use-callback-ref "^1.3.0"
    use-sidecar "^1.1.2"

react-style-singleton@^2.2.1:
  version "2.2.1"
  resolved "https://registry.yarnpkg.com/react-style-singleton/-/react-style-singleton-2.2.1.tgz#f99e420492b2d8f34d38308ff660b60d0b1205b4"
  integrity sha512-ZWj0fHEMyWkHzKYUr2Bs/4zU6XLmq9HsgBURm7g5pAVfyn49DgUiNgY2d4lXRlYSiCif9YBGpQleewkcqddc7g==
  dependencies:
    get-nonce "^1.0.0"
    invariant "^2.2.4"
    tslib "^2.0.0"

react@19.0.0-rc-66855b96-20241106:
  version "19.0.0-rc-66855b96-20241106"
  resolved "https://registry.yarnpkg.com/react/-/react-19.0.0-rc-66855b96-20241106.tgz#f04d7283454a32bdd8e9757db4308b75b9739e56"
  integrity sha512-klH7xkT71SxRCx4hb1hly5FJB21Hz0ACyxbXYAECEqssUjtJeFUAaI2U1DgJAzkGEnvEm3DkxuBchMC/9K4ipg==

read-cache@^1.0.0:
  version "1.0.0"
  resolved "https://registry.yarnpkg.com/read-cache/-/read-cache-1.0.0.tgz#e664ef31161166c9751cdbe8dbcf86b5fb58f774"
  integrity sha512-Owdv/Ft7IjOgm/i0xvNDZ1LrRANRfew4b2prF3OWMQLxLfu3bS8FVhCsrSCMK4lR56Y9ya+AThoTpDCTxCmpRA==
  dependencies:
    pify "^2.3.0"

readable-stream@^3.4.0:
  version "3.6.2"
  resolved "https://registry.yarnpkg.com/readable-stream/-/readable-stream-3.6.2.tgz#56a9b36ea965c00c5a93ef31eb111a0f11056967"
  integrity sha512-9u/sniCrY3D5WdsERHzHE4G2YCXqoG5FTHUiCC4SIbr6XcLZBY05ya9EKjYek9O5xOAwjGq+1JdGBAS7Q9ScoA==
  dependencies:
    inherits "^2.0.3"
    string_decoder "^1.1.1"
    util-deprecate "^1.0.1"

readdirp@~3.6.0:
  version "3.6.0"
  resolved "https://registry.yarnpkg.com/readdirp/-/readdirp-3.6.0.tgz#74a370bd857116e245b29cc97340cd431a02a6c7"
  integrity sha512-hOS089on8RduqdbhvQ5Z37A0ESjsqz6qnRcffsMU3495FuTdqSm+7bhJ29JvIOsBDEEnan5DPu9t3To9VRlMzA==
  dependencies:
    picomatch "^2.2.1"

reflect.getprototypeof@^1.0.4:
  version "1.0.6"
  resolved "https://registry.yarnpkg.com/reflect.getprototypeof/-/reflect.getprototypeof-1.0.6.tgz#3ab04c32a8390b770712b7a8633972702d278859"
  integrity sha512-fmfw4XgoDke3kdI6h4xcUz1dG8uaiv5q9gcEwLS4Pnth2kxT+GZ7YehS1JTMGBQmtV7Y4GFGbs2re2NqhdozUg==
  dependencies:
    call-bind "^1.0.7"
    define-properties "^1.2.1"
    es-abstract "^1.23.1"
    es-errors "^1.3.0"
    get-intrinsic "^1.2.4"
    globalthis "^1.0.3"
    which-builtin-type "^1.1.3"

regexp.prototype.flags@^1.5.2:
  version "1.5.3"
  resolved "https://registry.yarnpkg.com/regexp.prototype.flags/-/regexp.prototype.flags-1.5.3.tgz#b3ae40b1d2499b8350ab2c3fe6ef3845d3a96f42"
  integrity sha512-vqlC04+RQoFalODCbCumG2xIOvapzVMHwsyIGM/SIE8fRhFFsXeH8/QQ+s0T0kDAhKc4k30s73/0ydkHQz6HlQ==
  dependencies:
    call-bind "^1.0.7"
    define-properties "^1.2.1"
    es-errors "^1.3.0"
    set-function-name "^2.0.2"

resolve-from@^4.0.0:
  version "4.0.0"
  resolved "https://registry.yarnpkg.com/resolve-from/-/resolve-from-4.0.0.tgz#4abcd852ad32dd7baabfe9b40e00a36db5f392e6"
  integrity sha512-pb/MYmXstAkysRFx8piNI1tGFNQIFA3vkE3Gq4EuA1dF6gHp/+vgZqsCGJapvy8N3Q+4o7FwvquPJcnZ7RYy4g==

resolve-pkg-maps@^1.0.0:
  version "1.0.0"
  resolved "https://registry.yarnpkg.com/resolve-pkg-maps/-/resolve-pkg-maps-1.0.0.tgz#616b3dc2c57056b5588c31cdf4b3d64db133720f"
  integrity sha512-seS2Tj26TBVOC2NIc2rOe2y2ZO7efxITtLZcGSOnHHNOQ7CkiUBfw0Iw2ck6xkIhPwLhKNLS8BO+hEpngQlqzw==

resolve@^1.1.7, resolve@^1.22.2, resolve@^1.22.4:
  version "1.22.8"
  resolved "https://registry.yarnpkg.com/resolve/-/resolve-1.22.8.tgz#b6c87a9f2aa06dfab52e3d70ac8cde321fa5a48d"
  integrity sha512-oKWePCxqpd6FlLvGV1VU0x7bkPmmCNolxzjMf4NczoDnQcIWrAF+cPtZn5i6n+RfD2d9i0tzpKnG6Yk168yIyw==
  dependencies:
    is-core-module "^2.13.0"
    path-parse "^1.0.7"
    supports-preserve-symlinks-flag "^1.0.0"

resolve@^2.0.0-next.5:
  version "2.0.0-next.5"
  resolved "https://registry.yarnpkg.com/resolve/-/resolve-2.0.0-next.5.tgz#6b0ec3107e671e52b68cd068ef327173b90dc03c"
  integrity sha512-U7WjGVG9sH8tvjW5SmGbQuui75FiyjAX72HX15DwBBwF9dNiQZRQAg9nnPhYy+TUnE0+VcrttuvNI8oSxZcocA==
  dependencies:
    is-core-module "^2.13.0"
    path-parse "^1.0.7"
    supports-preserve-symlinks-flag "^1.0.0"

restore-cursor@^4.0.0:
  version "4.0.0"
  resolved "https://registry.yarnpkg.com/restore-cursor/-/restore-cursor-4.0.0.tgz#519560a4318975096def6e609d44100edaa4ccb9"
  integrity sha512-I9fPXU9geO9bHOt9pHHOhOkYerIMsmVaWB0rA2AI9ERh/+x/i7MV5HKBNrg+ljO5eoPVgCcnFuRjJ9uH6I/3eg==
  dependencies:
    onetime "^5.1.0"
    signal-exit "^3.0.2"

reusify@^1.0.4:
  version "1.0.4"
  resolved "https://registry.yarnpkg.com/reusify/-/reusify-1.0.4.tgz#90da382b1e126efc02146e90845a88db12925d76"
  integrity sha512-U9nH88a3fc/ekCF1l0/UP1IosiuIjyTh7hBvXVMHYgVcfGvt897Xguj2UOLDeI5BG2m7/uwyaLVT6fbtCwTyzw==

rimraf@^3.0.2:
  version "3.0.2"
  resolved "https://registry.yarnpkg.com/rimraf/-/rimraf-3.0.2.tgz#f1a5402ba6220ad52cc1282bac1ae3aa49fd061a"
  integrity sha512-JZkJMZkAGFFPP2YqXZXPbMlMBgsxzE8ILs4lMIX/2o0L9UBw9O/Y3o6wFw/i9YLapcUJWwqbi3kdxIPdC62TIA==
  dependencies:
    glob "^7.1.3"

run-parallel@^1.1.9:
  version "1.2.0"
  resolved "https://registry.yarnpkg.com/run-parallel/-/run-parallel-1.2.0.tgz#66d1368da7bdf921eb9d95bd1a9229e7f21a43ee"
  integrity sha512-5l4VyZR86LZ/lDxZTR6jqL8AFE2S0IFLMP26AbjsLVADxHdhB/c0GUsH+y39UfCi3dzz8OlQuPmnaJOMoDHQBA==
  dependencies:
    queue-microtask "^1.2.2"

safe-array-concat@^1.1.2:
  version "1.1.2"
  resolved "https://registry.yarnpkg.com/safe-array-concat/-/safe-array-concat-1.1.2.tgz#81d77ee0c4e8b863635227c721278dd524c20edb"
  integrity sha512-vj6RsCsWBCf19jIeHEfkRMw8DPiBb+DMXklQ/1SGDHOMlHdPUkZXFQ2YdplS23zESTijAcurb1aSgJA3AgMu1Q==
  dependencies:
    call-bind "^1.0.7"
    get-intrinsic "^1.2.4"
    has-symbols "^1.0.3"
    isarray "^2.0.5"

safe-buffer@~5.2.0:
  version "5.2.1"
  resolved "https://registry.yarnpkg.com/safe-buffer/-/safe-buffer-5.2.1.tgz#1eaf9fa9bdb1fdd4ec75f58f9cdb4e6b7827eec6"
  integrity sha512-rp3So07KcdmmKbGvgaNxQSJr7bGVSVk5S9Eq1F+ppbRo70+YeaDxkw5Dd8NPN+GD6bjnYm2VuPuCXmpuYvmCXQ==

safe-regex-test@^1.0.3:
  version "1.0.3"
  resolved "https://registry.yarnpkg.com/safe-regex-test/-/safe-regex-test-1.0.3.tgz#a5b4c0f06e0ab50ea2c395c14d8371232924c377"
  integrity sha512-CdASjNJPvRa7roO6Ra/gLYBTzYzzPyyBXxIMdGW3USQLyjWEls2RgW5UBTXaQVp+OrpeCK3bLem8smtmheoRuw==
  dependencies:
    call-bind "^1.0.6"
    es-errors "^1.3.0"
    is-regex "^1.1.4"

scheduler@0.25.0-rc-66855b96-20241106:
  version "0.25.0-rc-66855b96-20241106"
  resolved "https://registry.yarnpkg.com/scheduler/-/scheduler-0.25.0-rc-66855b96-20241106.tgz#8bbb728eca4de5a5deca1f18370fbce41aee91d1"
  integrity sha512-HQXp/Mnp/MMRSXMQF7urNFla+gmtXW/Gr1KliuR0iboTit4KvZRY8KYaq5ccCTAOJiUqQh2rE2F3wgUekmgdlA==

semver@^6.3.1:
  version "6.3.1"
  resolved "https://registry.yarnpkg.com/semver/-/semver-6.3.1.tgz#556d2ef8689146e46dcea4bfdd095f3434dffcb4"
  integrity sha512-BR7VvDCVHO+q2xBEWskxS6DJE1qRnb7DxzUrogb71CWoSficBxYsiAGd+Kl0mmq/MprG9yArRkyrQxTO6XjMzA==

semver@^7.6.0, semver@^7.6.3:
  version "7.6.3"
  resolved "https://registry.yarnpkg.com/semver/-/semver-7.6.3.tgz#980f7b5550bc175fb4dc09403085627f9eb33143"
  integrity sha512-oVekP1cKtI+CTDvHWYFUcMtsK/00wmAEfyqKfNdARm8u1wNVhSgaX7A8d4UuIlUI5e84iEwOhs7ZPYRmzU9U6A==

set-cookie-parser@^2.6.0:
  version "2.7.1"
  resolved "https://registry.yarnpkg.com/set-cookie-parser/-/set-cookie-parser-2.7.1.tgz#3016f150072202dfbe90fadee053573cc89d2943"
  integrity sha512-IOc8uWeOZgnb3ptbCURJWNjWUPcO3ZnTTdzsurqERrP6nPyv+paC55vJM0LpOlT2ne+Ix+9+CRG1MNLlyZ4GjQ==

set-function-length@^1.2.1:
  version "1.2.2"
  resolved "https://registry.yarnpkg.com/set-function-length/-/set-function-length-1.2.2.tgz#aac72314198eaed975cf77b2c3b6b880695e5449"
  integrity sha512-pgRc4hJ4/sNjWCSS9AmnS40x3bNMDTknHgL5UaMBTMyJnU90EgWh1Rz+MC9eFu4BuN/UwZjKQuY/1v3rM7HMfg==
  dependencies:
    define-data-property "^1.1.4"
    es-errors "^1.3.0"
    function-bind "^1.1.2"
    get-intrinsic "^1.2.4"
    gopd "^1.0.1"
    has-property-descriptors "^1.0.2"

set-function-name@^2.0.1, set-function-name@^2.0.2:
  version "2.0.2"
  resolved "https://registry.yarnpkg.com/set-function-name/-/set-function-name-2.0.2.tgz#16a705c5a0dc2f5e638ca96d8a8cd4e1c2b90985"
  integrity sha512-7PGFlmtwsEADb0WYyvCMa1t+yke6daIG4Wirafur5kcf+MhUnPms1UeR0CKQdTZD81yESwMHbtn+TR+dMviakQ==
  dependencies:
    define-data-property "^1.1.4"
    es-errors "^1.3.0"
    functions-have-names "^1.2.3"
    has-property-descriptors "^1.0.2"

sharp@^0.33.5:
  version "0.33.5"
  resolved "https://registry.yarnpkg.com/sharp/-/sharp-0.33.5.tgz#13e0e4130cc309d6a9497596715240b2ec0c594e"
  integrity sha512-haPVm1EkS9pgvHrQ/F3Xy+hgcuMV0Wm9vfIBSiwZ05k+xgb0PkBQpGsAA/oWdDobNaZTH5ppvHtzCFbnSEwHVw==
  dependencies:
    color "^4.2.3"
    detect-libc "^2.0.3"
    semver "^7.6.3"
  optionalDependencies:
    "@img/sharp-darwin-arm64" "0.33.5"
    "@img/sharp-darwin-x64" "0.33.5"
    "@img/sharp-libvips-darwin-arm64" "1.0.4"
    "@img/sharp-libvips-darwin-x64" "1.0.4"
    "@img/sharp-libvips-linux-arm" "1.0.5"
    "@img/sharp-libvips-linux-arm64" "1.0.4"
    "@img/sharp-libvips-linux-s390x" "1.0.4"
    "@img/sharp-libvips-linux-x64" "1.0.4"
    "@img/sharp-libvips-linuxmusl-arm64" "1.0.4"
    "@img/sharp-libvips-linuxmusl-x64" "1.0.4"
    "@img/sharp-linux-arm" "0.33.5"
    "@img/sharp-linux-arm64" "0.33.5"
    "@img/sharp-linux-s390x" "0.33.5"
    "@img/sharp-linux-x64" "0.33.5"
    "@img/sharp-linuxmusl-arm64" "0.33.5"
    "@img/sharp-linuxmusl-x64" "0.33.5"
    "@img/sharp-wasm32" "0.33.5"
    "@img/sharp-win32-ia32" "0.33.5"
    "@img/sharp-win32-x64" "0.33.5"

shebang-command@^2.0.0:
  version "2.0.0"
  resolved "https://registry.yarnpkg.com/shebang-command/-/shebang-command-2.0.0.tgz#ccd0af4f8835fbdc265b82461aaf0c36663f34ea"
  integrity sha512-kHxr2zZpYtdmrN1qDjrrX/Z1rR1kG8Dx+gkpK1G4eXmvXswmcE1hTWBWYUzlraYw1/yZp6YuDY77YtvbN0dmDA==
  dependencies:
    shebang-regex "^3.0.0"

shebang-regex@^3.0.0:
  version "3.0.0"
  resolved "https://registry.yarnpkg.com/shebang-regex/-/shebang-regex-3.0.0.tgz#ae16f1644d873ecad843b0307b143362d4c42172"
  integrity sha512-7++dFhtcx3353uBaq8DDR4NuxBetBzC7ZQOhmTQInHEd6bSrXdiEyzCvG07Z44UYdLShWUyXt5M/yhz8ekcb1A==

side-channel@^1.0.4, side-channel@^1.0.6:
  version "1.0.6"
  resolved "https://registry.yarnpkg.com/side-channel/-/side-channel-1.0.6.tgz#abd25fb7cd24baf45466406b1096b7831c9215f2"
  integrity sha512-fDW/EZ6Q9RiO8eFG8Hj+7u/oW+XrPTIChwCOM2+th2A6OblDtYYIpve9m+KvI9Z4C9qSEXlaGR6bTEYHReuglA==
  dependencies:
    call-bind "^1.0.7"
    es-errors "^1.3.0"
    get-intrinsic "^1.2.4"
    object-inspect "^1.13.1"

signal-exit@^3.0.2, signal-exit@^3.0.7:
  version "3.0.7"
  resolved "https://registry.yarnpkg.com/signal-exit/-/signal-exit-3.0.7.tgz#a9a1767f8af84155114eaabd73f99273c8f59ad9"
  integrity sha512-wnD2ZE+l+SPC/uoS0vXeE9L1+0wuaMqKlfz9AMUo38JsyLSBWSFcHR1Rri62LZc12vLr1gb3jl7iwQhgwpAbGQ==

signal-exit@^4.0.1:
  version "4.1.0"
  resolved "https://registry.yarnpkg.com/signal-exit/-/signal-exit-4.1.0.tgz#952188c1cbd546070e2dd20d0f41c0ae0530cb04"
  integrity sha512-bzyZ1e88w9O1iNJbKnOlvYTrWPDl46O1bG0D3XInv+9tkPrxrN8jUUTiFlDkkmKWgn1M6CfIA13SuGqOa9Korw==

simple-swizzle@^0.2.2:
  version "0.2.2"
  resolved "https://registry.yarnpkg.com/simple-swizzle/-/simple-swizzle-0.2.2.tgz#a4da6b635ffcccca33f70d17cb92592de95e557a"
  integrity sha512-JA//kQgZtbuY83m+xT+tXJkmJncGMTFT+C+g2h2R9uxkYIrE2yy9sgmcLhCnw57/WSD+Eh3J97FPEDFnbXnDUg==
  dependencies:
    is-arrayish "^0.3.1"

sisteransi@^1.0.5:
  version "1.0.5"
  resolved "https://registry.yarnpkg.com/sisteransi/-/sisteransi-1.0.5.tgz#134d681297756437cc05ca01370d3a7a571075ed"
  integrity sha512-bLGGlR1QxBcynn2d5YmDX4MGjlZvy2MRBDRNHLJ8VI6l6+9FUiyTFNJ0IveOSP0bcXgVDPRcfGqA0pjaqUpfVg==

source-map-js@^1.0.2, source-map-js@^1.2.1:
  version "1.2.1"
  resolved "https://registry.yarnpkg.com/source-map-js/-/source-map-js-1.2.1.tgz#1ce5650fddd87abc099eda37dcff024c2667ae46"
  integrity sha512-UXWMKhLOwVKb728IUtQPXxfYU+usdybtUrK/8uGE8CQMvrhOpwvzDBwj0QhSL7MQc7vIsISBG8VQ8+IDQxpfQA==

stdin-discarder@^0.1.0:
  version "0.1.0"
  resolved "https://registry.yarnpkg.com/stdin-discarder/-/stdin-discarder-0.1.0.tgz#22b3e400393a8e28ebf53f9958f3880622efde21"
  integrity sha512-xhV7w8S+bUwlPTb4bAOUQhv8/cSS5offJuX8GQGq32ONF0ZtDWKfkdomM3HMRA+LhX6um/FZ0COqlwsjD53LeQ==
  dependencies:
    bl "^5.0.0"

streamsearch@^1.1.0:
  version "1.1.0"
  resolved "https://registry.yarnpkg.com/streamsearch/-/streamsearch-1.1.0.tgz#404dd1e2247ca94af554e841a8ef0eaa238da764"
  integrity sha512-Mcc5wHehp9aXz1ax6bZUyY5afg9u2rv5cqQI3mRrYkGC8rW2hM02jWuwjtL++LS5qinSyhj2QfLyNsuc+VsExg==

"string-width-cjs@npm:string-width@^4.2.0", string-width@^4.1.0:
  name string-width-cjs
  version "4.2.3"
  resolved "https://registry.yarnpkg.com/string-width/-/string-width-4.2.3.tgz#269c7117d27b05ad2e536830a8ec895ef9c6d010"
  integrity sha512-wKyQRQpjJ0sIp62ErSZdGsjMJWsap5oRNihHhu6G7JVO/9jIB6UyevL+tXuOqrng8j/cxKTWyWUwvSTriiZz/g==
  dependencies:
    emoji-regex "^8.0.0"
    is-fullwidth-code-point "^3.0.0"
    strip-ansi "^6.0.1"

string-width@^5.0.1, string-width@^5.1.2:
  version "5.1.2"
  resolved "https://registry.yarnpkg.com/string-width/-/string-width-5.1.2.tgz#14f8daec6d81e7221d2a357e668cab73bdbca794"
  integrity sha512-HnLOCR3vjcY8beoNLtcjZ5/nxn2afmME6lhrDrebokqMap+XbeW8n9TXpPDOqdGK5qcI3oT0GKTW6wC7EMiVqA==
  dependencies:
    eastasianwidth "^0.2.0"
    emoji-regex "^9.2.2"
    strip-ansi "^7.0.1"

string.prototype.includes@^2.0.1:
  version "2.0.1"
  resolved "https://registry.yarnpkg.com/string.prototype.includes/-/string.prototype.includes-2.0.1.tgz#eceef21283640761a81dbe16d6c7171a4edf7d92"
  integrity sha512-o7+c9bW6zpAdJHTtujeePODAhkuicdAryFsfVKwA+wGw89wJ4GTY484WTucM9hLtDEOpOvI+aHnzqnC5lHp4Rg==
  dependencies:
    call-bind "^1.0.7"
    define-properties "^1.2.1"
    es-abstract "^1.23.3"

string.prototype.matchall@^4.0.11:
  version "4.0.11"
  resolved "https://registry.yarnpkg.com/string.prototype.matchall/-/string.prototype.matchall-4.0.11.tgz#1092a72c59268d2abaad76582dccc687c0297e0a"
  integrity sha512-NUdh0aDavY2og7IbBPenWqR9exH+E26Sv8e0/eTe1tltDGZL+GtBkDAnnyBtmekfK6/Dq3MkcGtzXFEd1LQrtg==
  dependencies:
    call-bind "^1.0.7"
    define-properties "^1.2.1"
    es-abstract "^1.23.2"
    es-errors "^1.3.0"
    es-object-atoms "^1.0.0"
    get-intrinsic "^1.2.4"
    gopd "^1.0.1"
    has-symbols "^1.0.3"
    internal-slot "^1.0.7"
    regexp.prototype.flags "^1.5.2"
    set-function-name "^2.0.2"
    side-channel "^1.0.6"

string.prototype.repeat@^1.0.0:
  version "1.0.0"
  resolved "https://registry.yarnpkg.com/string.prototype.repeat/-/string.prototype.repeat-1.0.0.tgz#e90872ee0308b29435aa26275f6e1b762daee01a"
  integrity sha512-0u/TldDbKD8bFCQ/4f5+mNRrXwZ8hg2w7ZR8wa16e8z9XpePWl3eGEcUD0OXpEH/VJH/2G3gjUtR3ZOiBe2S/w==
  dependencies:
    define-properties "^1.1.3"
    es-abstract "^1.17.5"

string.prototype.trim@^1.2.9:
  version "1.2.9"
  resolved "https://registry.yarnpkg.com/string.prototype.trim/-/string.prototype.trim-1.2.9.tgz#b6fa326d72d2c78b6df02f7759c73f8f6274faa4"
  integrity sha512-klHuCNxiMZ8MlsOihJhJEBJAiMVqU3Z2nEXWfWnIqjN0gEFS9J9+IxKozWWtQGcgoa1WUZzLjKPTr4ZHNFTFxw==
  dependencies:
    call-bind "^1.0.7"
    define-properties "^1.2.1"
    es-abstract "^1.23.0"
    es-object-atoms "^1.0.0"

string.prototype.trimend@^1.0.8:
  version "1.0.8"
  resolved "https://registry.yarnpkg.com/string.prototype.trimend/-/string.prototype.trimend-1.0.8.tgz#3651b8513719e8a9f48de7f2f77640b26652b229"
  integrity sha512-p73uL5VCHCO2BZZ6krwwQE3kCzM7NKmis8S//xEC6fQonchbum4eP6kR4DLEjQFO3Wnj3Fuo8NM0kOSjVdHjZQ==
  dependencies:
    call-bind "^1.0.7"
    define-properties "^1.2.1"
    es-object-atoms "^1.0.0"

string.prototype.trimstart@^1.0.8:
  version "1.0.8"
  resolved "https://registry.yarnpkg.com/string.prototype.trimstart/-/string.prototype.trimstart-1.0.8.tgz#7ee834dda8c7c17eff3118472bb35bfedaa34dde"
  integrity sha512-UXSH262CSZY1tfu3G3Secr6uGLCFVPMhIqHjlgCUtCCcgihYc/xKs9djMTMUOb2j1mVSeU8EU6NWc/iQKU6Gfg==
  dependencies:
    call-bind "^1.0.7"
    define-properties "^1.2.1"
    es-object-atoms "^1.0.0"

string_decoder@^1.1.1:
  version "1.3.0"
  resolved "https://registry.yarnpkg.com/string_decoder/-/string_decoder-1.3.0.tgz#42f114594a46cf1a8e30b0a84f56c78c3edac21e"
  integrity sha512-hkRX8U1WjJFd8LsDJ2yQ/wWWxaopEsABU1XfkM8A+j0+85JAGppt16cr1Whg6KIbb4okU6Mql6BOj+uup/wKeA==
  dependencies:
    safe-buffer "~5.2.0"

"strip-ansi-cjs@npm:strip-ansi@^6.0.1", strip-ansi@^6.0.0, strip-ansi@^6.0.1:
  name strip-ansi-cjs
  version "6.0.1"
  resolved "https://registry.yarnpkg.com/strip-ansi/-/strip-ansi-6.0.1.tgz#9e26c63d30f53443e9489495b2105d37b67a85d9"
  integrity sha512-Y38VPSHcqkFrCpFnQ9vuSXmquuv5oXOKpGeT6aGrr3o3Gc9AlVa6JBfUSOCnbxGGZF+/0ooI7KrPuUSztUdU5A==
  dependencies:
    ansi-regex "^5.0.1"

strip-ansi@^7.0.1:
  version "7.1.0"
  resolved "https://registry.yarnpkg.com/strip-ansi/-/strip-ansi-7.1.0.tgz#d5b6568ca689d8561370b0707685d22434faff45"
  integrity sha512-iq6eVVI64nQQTRYq2KtEg2d2uU7LElhTJwsH4YzIHZshxlgZms/wIc4VoDQTlG/IvVIrBKG06CrZnp0qv7hkcQ==
  dependencies:
    ansi-regex "^6.0.1"

strip-bom@^3.0.0:
  version "3.0.0"
  resolved "https://registry.yarnpkg.com/strip-bom/-/strip-bom-3.0.0.tgz#2334c18e9c759f7bdd56fdef7e9ae3d588e68ed3"
  integrity sha512-vavAMRXOgBVNF6nyEEmL3DBK19iRpDcoIwW+swQ+CbGiu7lju6t+JklA1MHweoWtadgt4ISVUsXLyDq34ddcwA==

strip-final-newline@^3.0.0:
  version "3.0.0"
  resolved "https://registry.yarnpkg.com/strip-final-newline/-/strip-final-newline-3.0.0.tgz#52894c313fbff318835280aed60ff71ebf12b8fd"
  integrity sha512-dOESqjYr96iWYylGObzd39EuNTa5VJxyvVAEm5Jnh7KGo75V43Hk1odPQkNDyXNmUR6k+gEiDVXnjB8HJ3crXw==

strip-json-comments@^3.1.1:
  version "3.1.1"
  resolved "https://registry.yarnpkg.com/strip-json-comments/-/strip-json-comments-3.1.1.tgz#31f1281b3832630434831c310c01cccda8cbe006"
  integrity sha512-6fPc+R4ihwqP6N/aIv2f1gMH8lOVtWQHoqC4yK6oSDVVocumAsfCqjkXnqiYMhmMwS/mEHLp7Vehlt3ql6lEig==

styled-jsx@5.1.6:
  version "5.1.6"
  resolved "https://registry.yarnpkg.com/styled-jsx/-/styled-jsx-5.1.6.tgz#83b90c077e6c6a80f7f5e8781d0f311b2fe41499"
  integrity sha512-qSVyDTeMotdvQYoHWLNGwRFJHC+i+ZvdBRYosOFgC+Wg1vx4frN2/RG/NA7SYqqvKNLf39P2LSRA2pu6n0XYZA==
  dependencies:
    client-only "0.0.1"

sucrase@^3.32.0:
  version "3.35.0"
  resolved "https://registry.yarnpkg.com/sucrase/-/sucrase-3.35.0.tgz#57f17a3d7e19b36d8995f06679d121be914ae263"
  integrity sha512-8EbVDiu9iN/nESwxeSxDKe0dunta1GOlHufmSSXxMD2z2/tMZpDMpvXQGsc+ajGo8y2uYUmixaSRUc/QPoQ0GA==
  dependencies:
    "@jridgewell/gen-mapping" "^0.3.2"
    commander "^4.0.0"
    glob "^10.3.10"
    lines-and-columns "^1.1.6"
    mz "^2.7.0"
    pirates "^4.0.1"
    ts-interface-checker "^0.1.9"

supports-color@^7.1.0:
  version "7.2.0"
  resolved "https://registry.yarnpkg.com/supports-color/-/supports-color-7.2.0.tgz#1b7dcdcb32b8138801b3e478ba6a51caa89648da"
  integrity sha512-qpCAvRl9stuOHveKsn7HncJRvv501qIacKzQlO/+Lwxc9+0q2wLyv4Dfvt80/DPn2pqOBsJdDiogXGR9+OvwRw==
  dependencies:
    has-flag "^4.0.0"

supports-preserve-symlinks-flag@^1.0.0:
  version "1.0.0"
  resolved "https://registry.yarnpkg.com/supports-preserve-symlinks-flag/-/supports-preserve-symlinks-flag-1.0.0.tgz#6eda4bd344a3c94aea376d4cc31bc77311039e09"
  integrity sha512-ot0WnXS9fgdkgIcePe6RHNk1WA8+muPa6cSjeR3V8K27q9BB1rTE3R1p7Hv0z1ZyAc8s6Vvv8DIyWf681MAt0w==

tailwind-merge@^2.5.4:
  version "2.5.4"
  resolved "https://registry.yarnpkg.com/tailwind-merge/-/tailwind-merge-2.5.4.tgz#4bf574e81fa061adeceba099ae4df56edcee78d1"
  integrity sha512-0q8cfZHMu9nuYP/b5Shb7Y7Sh1B7Nnl5GqNr1U+n2p6+mybvRtayrQ+0042Z5byvTA8ihjlP8Odo8/VnHbZu4Q==

tailwindcss-animate@^1.0.7:
  version "1.0.7"
  resolved "https://registry.yarnpkg.com/tailwindcss-animate/-/tailwindcss-animate-1.0.7.tgz#318b692c4c42676cc9e67b19b78775742388bef4"
  integrity sha512-bl6mpH3T7I3UFxuvDEXLxy/VuFxBk5bbzplh7tXI68mwMokNYd1t9qPBHlnyTwfa4JGC4zP516I1hYYtQ/vspA==

tailwindcss@^3.4.14:
  version "3.4.14"
  resolved "https://registry.yarnpkg.com/tailwindcss/-/tailwindcss-3.4.14.tgz#6dd23a7f54ec197b19159e91e3bb1e55e7aa73ac"
  integrity sha512-IcSvOcTRcUtQQ7ILQL5quRDg7Xs93PdJEk1ZLbhhvJc7uj/OAhYOnruEiwnGgBvUtaUAJ8/mhSw1o8L2jCiENA==
  dependencies:
    "@alloc/quick-lru" "^5.2.0"
    arg "^5.0.2"
    chokidar "^3.5.3"
    didyoumean "^1.2.2"
    dlv "^1.1.3"
    fast-glob "^3.3.0"
    glob-parent "^6.0.2"
    is-glob "^4.0.3"
    jiti "^1.21.0"
    lilconfig "^2.1.0"
    micromatch "^4.0.5"
    normalize-path "^3.0.0"
    object-hash "^3.0.0"
    picocolors "^1.0.0"
    postcss "^8.4.23"
    postcss-import "^15.1.0"
    postcss-js "^4.0.1"
    postcss-load-config "^4.0.1"
    postcss-nested "^6.0.1"
    postcss-selector-parser "^6.0.11"
    resolve "^1.22.2"
    sucrase "^3.32.0"

tapable@^2.2.0:
  version "2.2.1"
  resolved "https://registry.yarnpkg.com/tapable/-/tapable-2.2.1.tgz#1967a73ef4060a82f12ab96af86d52fdb76eeca0"
  integrity sha512-GNzQvQTOIP6RyTfE2Qxb8ZVlNmw0n88vp1szwWRimP02mnTsx3Wtn5qRdqY9w2XduFNUgvOwhNnQsjwCp+kqaQ==

text-table@^0.2.0:
  version "0.2.0"
  resolved "https://registry.yarnpkg.com/text-table/-/text-table-0.2.0.tgz#7f5ee823ae805207c00af2df4a84ec3fcfa570b4"
  integrity sha512-N+8UisAXDGk8PFXP4HAzVR9nbfmVJ3zYLAWiTIoqC5v5isinhr+r5uaO8+7r3BMfuNIufIsA7RdpVgacC2cSpw==

thenify-all@^1.0.0:
  version "1.6.0"
  resolved "https://registry.yarnpkg.com/thenify-all/-/thenify-all-1.6.0.tgz#1a1918d402d8fc3f98fbf234db0bcc8cc10e9726"
  integrity sha512-RNxQH/qI8/t3thXJDwcstUO4zeqo64+Uy/+sNVRBx4Xn2OX+OZ9oP+iJnNFqplFra2ZUVeKCSa2oVWi3T4uVmA==
  dependencies:
    thenify ">= 3.1.0 < 4"

"thenify@>= 3.1.0 < 4":
  version "3.3.1"
  resolved "https://registry.yarnpkg.com/thenify/-/thenify-3.3.1.tgz#8932e686a4066038a016dd9e2ca46add9838a95f"
  integrity sha512-RVZSIV5IG10Hk3enotrhvz0T9em6cyHBLkH/YAZuKqd8hRkKhSfCGIcP2KUY0EPxndzANBmNllzWPwak+bheSw==
  dependencies:
    any-promise "^1.0.0"

to-regex-range@^5.0.1:
  version "5.0.1"
  resolved "https://registry.yarnpkg.com/to-regex-range/-/to-regex-range-5.0.1.tgz#1648c44aae7c8d988a326018ed72f5b4dd0392e4"
  integrity sha512-65P7iz6X5yEr1cwcgvQxbbIw7Uk3gOy5dIdtZ4rDveLqhrdJP+Li/Hx6tyK0NEb+2GCyneCMJiGqrADCSNk8sQ==
  dependencies:
    is-number "^7.0.0"

tr46@~0.0.3:
  version "0.0.3"
  resolved "https://registry.yarnpkg.com/tr46/-/tr46-0.0.3.tgz#8184fd347dac9cdc185992f3a6622e14b9d9ab6a"
  integrity sha512-N3WMsuqV66lT30CrXNbEjx4GEwlow3v6rr4mCcv6prnfwhS01rkgyFdjPNBYd9br7LpXV1+Emh01fHnq2Gdgrw==

ts-api-utils@^1.3.0:
  version "1.4.0"
  resolved "https://registry.yarnpkg.com/ts-api-utils/-/ts-api-utils-1.4.0.tgz#709c6f2076e511a81557f3d07a0cbd566ae8195c"
  integrity sha512-032cPxaEKwM+GT3vA5JXNzIaizx388rhsSW79vGRNGXfRRAdEAn2mvk36PvK5HnOchyWZ7afLEXqYCvPCrzuzQ==

ts-interface-checker@^0.1.9:
  version "0.1.13"
  resolved "https://registry.yarnpkg.com/ts-interface-checker/-/ts-interface-checker-0.1.13.tgz#784fd3d679722bc103b1b4b8030bcddb5db2a699"
  integrity sha512-Y/arvbn+rrz3JCKl9C4kVNfTfSm2/mEp5FSz5EsZSANGPSlQrpRI5M4PKF+mJnE52jOO90PnPSc3Ur3bTQw0gA==

tsconfig-paths@^3.15.0:
  version "3.15.0"
  resolved "https://registry.yarnpkg.com/tsconfig-paths/-/tsconfig-paths-3.15.0.tgz#5299ec605e55b1abb23ec939ef15edaf483070d4"
  integrity sha512-2Ac2RgzDe/cn48GvOe3M+o82pEFewD3UPbyoUHHdKasHwJKjds4fLXWf/Ux5kATBKN20oaFGu+jbElp1pos0mg==
  dependencies:
    "@types/json5" "^0.0.29"
    json5 "^1.0.2"
    minimist "^1.2.6"
    strip-bom "^3.0.0"

tslib@^2.0.0, tslib@^2.1.0, tslib@^2.4.0:
  version "2.8.1"
  resolved "https://registry.yarnpkg.com/tslib/-/tslib-2.8.1.tgz#612efe4ed235d567e8aba5f2a5fab70280ade83f"
  integrity sha512-oJFu94HQb+KVduSUQL7wnpmqnfmLsOA/nAh6b6EH0wCEoK0/mPeXU6c3wKDV83MkOuHPRHtSXKKU99IBazS/2w==

type-check@^0.4.0, type-check@~0.4.0:
  version "0.4.0"
  resolved "https://registry.yarnpkg.com/type-check/-/type-check-0.4.0.tgz#07b8203bfa7056c0657050e3ccd2c37730bab8f1"
  integrity sha512-XleUoc9uwGXqjWwXaUTZAmzMcFZ5858QA2vvx1Ur5xIcixXIP+8LnFDgRplU30us6teqdlskFfu+ae4K79Ooew==
  dependencies:
    prelude-ls "^1.2.1"

type-fest@^0.20.2:
  version "0.20.2"
  resolved "https://registry.yarnpkg.com/type-fest/-/type-fest-0.20.2.tgz#1bf207f4b28f91583666cb5fbd327887301cd5f4"
  integrity sha512-Ne+eE4r0/iWnpAxD852z3A+N0Bt5RN//NjJwRd2VFHEmrywxf5vsZlh4R6lixl6B+wz/8d+maTSAkN1FIkI3LQ==

typed-array-buffer@^1.0.2:
  version "1.0.2"
  resolved "https://registry.yarnpkg.com/typed-array-buffer/-/typed-array-buffer-1.0.2.tgz#1867c5d83b20fcb5ccf32649e5e2fc7424474ff3"
  integrity sha512-gEymJYKZtKXzzBzM4jqa9w6Q1Jjm7x2d+sh19AdsD4wqnMPDYyvwpsIc2Q/835kHuo3BEQ7CjelGhfTsoBb2MQ==
  dependencies:
    call-bind "^1.0.7"
    es-errors "^1.3.0"
    is-typed-array "^1.1.13"

typed-array-byte-length@^1.0.1:
  version "1.0.1"
  resolved "https://registry.yarnpkg.com/typed-array-byte-length/-/typed-array-byte-length-1.0.1.tgz#d92972d3cff99a3fa2e765a28fcdc0f1d89dec67"
  integrity sha512-3iMJ9q0ao7WE9tWcaYKIptkNBuOIcZCCT0d4MRvuuH88fEoEH62IuQe0OtraD3ebQEoTRk8XCBoknUNc1Y67pw==
  dependencies:
    call-bind "^1.0.7"
    for-each "^0.3.3"
    gopd "^1.0.1"
    has-proto "^1.0.3"
    is-typed-array "^1.1.13"

typed-array-byte-offset@^1.0.2:
  version "1.0.2"
  resolved "https://registry.yarnpkg.com/typed-array-byte-offset/-/typed-array-byte-offset-1.0.2.tgz#f9ec1acb9259f395093e4567eb3c28a580d02063"
  integrity sha512-Ous0vodHa56FviZucS2E63zkgtgrACj7omjwd/8lTEMEPFFyjfixMZ1ZXenpgCFBBt4EC1J2XsyVS2gkG0eTFA==
  dependencies:
    available-typed-arrays "^1.0.7"
    call-bind "^1.0.7"
    for-each "^0.3.3"
    gopd "^1.0.1"
    has-proto "^1.0.3"
    is-typed-array "^1.1.13"

typed-array-length@^1.0.6:
  version "1.0.6"
  resolved "https://registry.yarnpkg.com/typed-array-length/-/typed-array-length-1.0.6.tgz#57155207c76e64a3457482dfdc1c9d1d3c4c73a3"
  integrity sha512-/OxDN6OtAk5KBpGb28T+HZc2M+ADtvRxXrKKbUwtsLgdoxgX13hyy7ek6bFRl5+aBs2yZzB0c4CnQfAtVypW/g==
  dependencies:
    call-bind "^1.0.7"
    for-each "^0.3.3"
    gopd "^1.0.1"
    has-proto "^1.0.3"
    is-typed-array "^1.1.13"
    possible-typed-array-names "^1.0.0"

typescript@^5:
  version "5.6.3"
  resolved "https://registry.yarnpkg.com/typescript/-/typescript-5.6.3.tgz#5f3449e31c9d94febb17de03cc081dd56d81db5b"
  integrity sha512-hjcS1mhfuyi4WW8IWtjP7brDrG2cuDZukyrYrSauoXGNgx0S7zceP07adYkJycEr56BOUTNPzbInooiN3fn1qw==

unbox-primitive@^1.0.2:
  version "1.0.2"
  resolved "https://registry.yarnpkg.com/unbox-primitive/-/unbox-primitive-1.0.2.tgz#29032021057d5e6cdbd08c5129c226dff8ed6f9e"
  integrity sha512-61pPlCD9h51VoreyJ0BReideM3MDKMKnh6+V9L08331ipq6Q8OFXZYiqP6n/tbHx4s5I9uRhcye6BrbkizkBDw==
  dependencies:
    call-bind "^1.0.2"
    has-bigints "^1.0.2"
    has-symbols "^1.0.3"
    which-boxed-primitive "^1.0.2"

undici-types@~6.19.8:
  version "6.19.8"
  resolved "https://registry.yarnpkg.com/undici-types/-/undici-types-6.19.8.tgz#35111c9d1437ab83a7cdc0abae2f26d88eda0a02"
  integrity sha512-ve2KP6f/JnbPBFyobGHuerC9g1FYGn/F8n1LWTwNxCEzd6IfqTwUQcNXgEtmmQ6DlRrC1hrSrBnCZPokRrDHjw==

universalify@^2.0.0:
  version "2.0.1"
  resolved "https://registry.yarnpkg.com/universalify/-/universalify-2.0.1.tgz#168efc2180964e6386d061e094df61afe239b18d"
  integrity sha512-gptHNQghINnc/vTGIk0SOFGFNXw7JVrlRUtConJRlvaw6DuX0wO5Jeko9sWrMBhh+PsYAZ7oXAiOnf/UKogyiw==

update-browserslist-db@^1.1.1:
  version "1.1.1"
  resolved "https://registry.yarnpkg.com/update-browserslist-db/-/update-browserslist-db-1.1.1.tgz#80846fba1d79e82547fb661f8d141e0945755fe5"
  integrity sha512-R8UzCaa9Az+38REPiJ1tXlImTJXlVfgHZsglwBD/k6nj76ctsH1E3q4doGrukiLQd3sGQYu56r5+lo5r94l29A==
  dependencies:
    escalade "^3.2.0"
    picocolors "^1.1.0"

uri-js@^4.2.2:
  version "4.4.1"
  resolved "https://registry.yarnpkg.com/uri-js/-/uri-js-4.4.1.tgz#9b1a52595225859e55f669d928f88c6c57f2a77e"
  integrity sha512-7rKUyy33Q1yc98pQ1DAmLtwX109F7TIfWlW1Ydo8Wl1ii1SeHieeh0HHfPeL2fMXK6z0s8ecKs9frCuLJvndBg==
  dependencies:
    punycode "^2.1.0"

use-callback-ref@^1.3.0:
  version "1.3.2"
  resolved "https://registry.yarnpkg.com/use-callback-ref/-/use-callback-ref-1.3.2.tgz#6134c7f6ff76e2be0b56c809b17a650c942b1693"
  integrity sha512-elOQwe6Q8gqZgDA8mrh44qRTQqpIHDcZ3hXTLjBe1i4ph8XpNJnO+aQf3NaG+lriLopI4HMx9VjQLfPQ6vhnoA==
  dependencies:
    tslib "^2.0.0"

use-sidecar@^1.1.2:
  version "1.1.2"
  resolved "https://registry.yarnpkg.com/use-sidecar/-/use-sidecar-1.1.2.tgz#2f43126ba2d7d7e117aa5855e5d8f0276dfe73c2"
  integrity sha512-epTbsLuzZ7lPClpz2TyryBfztm7m+28DlEv2ZCQ3MDr5ssiwyOwGH/e5F9CkfWjJ1t4clvI58yF822/GUkjjhw==
  dependencies:
    detect-node-es "^1.1.0"
    tslib "^2.0.0"

util-deprecate@^1.0.1, util-deprecate@^1.0.2:
  version "1.0.2"
  resolved "https://registry.yarnpkg.com/util-deprecate/-/util-deprecate-1.0.2.tgz#450d4dc9fa70de732762fbd2d4a28981419a0ccf"
  integrity sha512-EPD5q1uXyFxJpCrLnCc1nHnq3gOa6DZBocAIiI2TaSCA7VCJ1UJDMagCzIkXNsUYfD1daK//LTEQ8xiIbrHtcw==

wcwidth@^1.0.1:
  version "1.0.1"
  resolved "https://registry.yarnpkg.com/wcwidth/-/wcwidth-1.0.1.tgz#f0b0dcf915bc5ff1528afadb2c0e17b532da2fe8"
  integrity sha512-XHPEwS0q6TaxcvG85+8EYkbiCux2XtWG2mkc47Ng2A77BQu9+DqIOJldST4HgPkuea7dvKSj5VgX3P1d4rW8Tg==
  dependencies:
    defaults "^1.0.3"

web-streams-polyfill@^3.0.3:
  version "3.3.3"
  resolved "https://registry.yarnpkg.com/web-streams-polyfill/-/web-streams-polyfill-3.3.3.tgz#2073b91a2fdb1fbfbd401e7de0ac9f8214cecb4b"
  integrity sha512-d2JWLCivmZYTSIoge9MsgFCZrt571BikcWGYkjC1khllbTeDlGqZ2D8vD8E/lJa8WGWbb7Plm8/XJYV7IJHZZw==

webidl-conversions@^3.0.0:
  version "3.0.1"
  resolved "https://registry.yarnpkg.com/webidl-conversions/-/webidl-conversions-3.0.1.tgz#24534275e2a7bc6be7bc86611cc16ae0a5654871"
  integrity sha512-2JAn3z8AR6rjK8Sm8orRC0h/bcl/DqL7tRPdGZ4I1CjdF+EaMLmYxBHyXuKL849eucPFhvBoxMsflfOb8kxaeQ==

whatwg-url@^5.0.0:
  version "5.0.0"
  resolved "https://registry.yarnpkg.com/whatwg-url/-/whatwg-url-5.0.0.tgz#966454e8765462e37644d3626f6742ce8b70965d"
  integrity sha512-saE57nupxk6v3HY35+jzBwYa0rKSy0XR8JSxZPwgLr7ys0IBzhGviA1/TUGJLmSVqs8pb9AnvICXEuOHLprYTw==
  dependencies:
    tr46 "~0.0.3"
    webidl-conversions "^3.0.0"

which-boxed-primitive@^1.0.2:
  version "1.0.2"
  resolved "https://registry.yarnpkg.com/which-boxed-primitive/-/which-boxed-primitive-1.0.2.tgz#13757bc89b209b049fe5d86430e21cf40a89a8e6"
  integrity sha512-bwZdv0AKLpplFY2KZRX6TvyuN7ojjr7lwkg6ml0roIy9YeuSr7JS372qlNW18UQYzgYK9ziGcerWqZOmEn9VNg==
  dependencies:
    is-bigint "^1.0.1"
    is-boolean-object "^1.1.0"
    is-number-object "^1.0.4"
    is-string "^1.0.5"
    is-symbol "^1.0.3"

which-builtin-type@^1.1.3:
  version "1.1.4"
  resolved "https://registry.yarnpkg.com/which-builtin-type/-/which-builtin-type-1.1.4.tgz#592796260602fc3514a1b5ee7fa29319b72380c3"
  integrity sha512-bppkmBSsHFmIMSl8BO9TbsyzsvGjVoppt8xUiGzwiu/bhDCGxnpOKCxgqj6GuyHE0mINMDecBFPlOm2hzY084w==
  dependencies:
    function.prototype.name "^1.1.6"
    has-tostringtag "^1.0.2"
    is-async-function "^2.0.0"
    is-date-object "^1.0.5"
    is-finalizationregistry "^1.0.2"
    is-generator-function "^1.0.10"
    is-regex "^1.1.4"
    is-weakref "^1.0.2"
    isarray "^2.0.5"
    which-boxed-primitive "^1.0.2"
    which-collection "^1.0.2"
    which-typed-array "^1.1.15"

which-collection@^1.0.2:
  version "1.0.2"
  resolved "https://registry.yarnpkg.com/which-collection/-/which-collection-1.0.2.tgz#627ef76243920a107e7ce8e96191debe4b16c2a0"
  integrity sha512-K4jVyjnBdgvc86Y6BkaLZEN933SwYOuBFkdmBu9ZfkcAbdVbpITnDmjvZ/aQjRXQrv5EPkTnD1s39GiiqbngCw==
  dependencies:
    is-map "^2.0.3"
    is-set "^2.0.3"
    is-weakmap "^2.0.2"
    is-weakset "^2.0.3"

which-typed-array@^1.1.14, which-typed-array@^1.1.15:
  version "1.1.15"
  resolved "https://registry.yarnpkg.com/which-typed-array/-/which-typed-array-1.1.15.tgz#264859e9b11a649b388bfaaf4f767df1f779b38d"
  integrity sha512-oV0jmFtUky6CXfkqehVvBP/LSWJ2sy4vWMioiENyJLePrBO/yKyV9OyJySfAKosh+RYkIl5zJCNZ8/4JncrpdA==
  dependencies:
    available-typed-arrays "^1.0.7"
    call-bind "^1.0.7"
    for-each "^0.3.3"
    gopd "^1.0.1"
    has-tostringtag "^1.0.2"

which@^2.0.1:
  version "2.0.2"
  resolved "https://registry.yarnpkg.com/which/-/which-2.0.2.tgz#7c6a8dd0a636a0327e10b59c9286eee93f3f51b1"
  integrity sha512-BLI3Tl1TW3Pvl70l3yq3Y64i+awpwXqsGBYWkkqMtnbXgrMD+yj7rhW0kuEDxzJaYXGjEW5ogapKNMEKNMjibA==
  dependencies:
    isexe "^2.0.0"

word-wrap@^1.2.5:
  version "1.2.5"
  resolved "https://registry.yarnpkg.com/word-wrap/-/word-wrap-1.2.5.tgz#d2c45c6dd4fbce621a66f136cbe328afd0410b34"
  integrity sha512-BN22B5eaMMI9UMtjrGd5g5eCYPpCPDUy0FJXbYsaT5zYxjFOckS53SQDE3pWkVoWpHXVb3BrYcEN4Twa55B5cA==

"wrap-ansi-cjs@npm:wrap-ansi@^7.0.0":
  version "7.0.0"
  resolved "https://registry.yarnpkg.com/wrap-ansi/-/wrap-ansi-7.0.0.tgz#67e145cff510a6a6984bdf1152911d69d2eb9e43"
  integrity sha512-YVGIj2kamLSTxw6NsZjoBxfSwsn0ycdesmc4p+Q21c5zPuZ1pl+NfxVdxPtdHvmNVOQ6XSYG4AUtyt/Fi7D16Q==
  dependencies:
    ansi-styles "^4.0.0"
    string-width "^4.1.0"
    strip-ansi "^6.0.0"

wrap-ansi@^8.1.0:
  version "8.1.0"
  resolved "https://registry.yarnpkg.com/wrap-ansi/-/wrap-ansi-8.1.0.tgz#56dc22368ee570face1b49819975d9b9a5ead214"
  integrity sha512-si7QWI6zUMq56bESFvagtmzMdGOtoxfR+Sez11Mobfc7tm+VkUckk9bW2UeffTGVUbOksxmSw0AA2gs8g71NCQ==
  dependencies:
    ansi-styles "^6.1.0"
    string-width "^5.0.1"
    strip-ansi "^7.0.1"

wrappy@1:
  version "1.0.2"
  resolved "https://registry.yarnpkg.com/wrappy/-/wrappy-1.0.2.tgz#b5243d8f3ec1aa35f1364605bc0d1036e30ab69f"
  integrity sha512-l4Sp/DRseor9wL6EvV2+TuQn63dMkPjZ/sp9XkghTEbV9KlPS1xUsZ3u7/IQO4wxtcFB4bgpQPRcR3QCvezPcQ==

ws@^8.14.2:
  version "8.18.0"
  resolved "https://registry.yarnpkg.com/ws/-/ws-8.18.0.tgz#0d7505a6eafe2b0e712d232b42279f53bc289bbc"
  integrity sha512-8VbfWfHLbbwu3+N6OKsOMpBdT4kXPDDB9cJk2bJ6mh9ucxdlnNvH1e+roYkKmN9Nxw2yjz7VzeO9oOz2zJ04Pw==

yaml@^2.3.4:
  version "2.6.0"
  resolved "https://registry.yarnpkg.com/yaml/-/yaml-2.6.0.tgz#14059ad9d0b1680d0f04d3a60fe00f3a857303c3"
  integrity sha512-a6ae//JvKDEra2kdi1qzCyrJW/WZCgFi8ydDV+eXExl95t+5R+ijnqHJbz9tmMh8FUjx3iv2fCQ4dclAQlO2UQ==

yocto-queue@^0.1.0:
  version "0.1.0"
  resolved "https://registry.yarnpkg.com/yocto-queue/-/yocto-queue-0.1.0.tgz#0294eb3dee05028d31ee1a5fa2c556a6aaf10a1b"
  integrity sha512-rVksvsnNCdJ/ohGc6xgPwyN8eheCxsiLM8mxuE/t/mOVqJewPuO1miLpTHQiRgTKCLexL4MeAFVagts7HmNZ2Q==

zod@^3.20.2, zod@^3.23.8:
  version "3.23.8"
  resolved "https://registry.yarnpkg.com/zod/-/zod-3.23.8.tgz#e37b957b5d52079769fb8097099b592f0ef4067d"
  integrity sha512-XBx9AXhXktjUqnepgTiE5flcKIYWi/rme0Eaj+5Y0lftuGBq+jyRu/md4WnuxqgP1ubdpNCsYEYPxrzVHD8d6g==

```

### lib/utils.ts

```typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

```

### hooks/use-toast.ts

```typescript
"use client"

// Inspired by react-hot-toast library
import * as React from "react"

import type {
  ToastActionElement,
  ToastProps,
} from "@/src/components/ui/toast"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"]
    }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

type Toast = Omit<ToasterToast, "id">

function toast({ ...props }: Toast) {
  const id = genId()

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { useToast, toast }

```

### app/favicon.ico

```ico
Error reading file: 'utf-8' codec can't decode byte 0x96 in position 50: invalid start byte
```

### app/globals.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
 
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 240 10% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 240 10% 3.9%;
    --primary: 240 5.9% 10%;
    --primary-foreground: 0 0% 98%;
    --secondary: 240 4.8% 95.9%;
    --secondary-foreground: 240 5.9% 10%;
    --muted: 240 4.8% 95.9%;
    --muted-foreground: 240 3.8% 46.1%;
    --accent: 240 4.8% 95.9%;
    --accent-foreground: 240 5.9% 10%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 5.9% 90%;
    --input: 240 5.9% 90%;
    --ring: 240 5.9% 10%;
    --radius: 0.5rem;
  }
 
  .dark {
    --background: 240 10% 3.9%;
    --foreground: 0 0% 98%;
    --card: 240 10% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 240 10% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 240 5.9% 10%;
    --secondary: 240 3.7% 15.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 240 3.7% 15.9%;
    --muted-foreground: 240 5% 64.9%;
    --accent: 240 3.7% 15.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 3.7% 15.9%;
    --input: 240 3.7% 15.9%;
    --ring: 240 4.9% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

### app/layout.tsx

```typescript
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

```

### app/page.tsx

```typescript
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { DataManagement } from "@/components/data/data-management";

export default async function Home() {
  const supabase = createServerComponentClient({ cookies });
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const { data: entries, error } = await supabase
    .from("data_entries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching entries:", error);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Data Management</h1>
          <p className="text-muted-foreground">
            View and manage your data entries.
          </p>
        </div>

        <DataManagement initialData={entries || []} />
      </div>
    </div>
  );
}
```

### app/dashboard/layout.tsx

```typescript
"use client";

import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import type { Database } from "@/lib/supabase/client";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
      } else if (session.user?.email) {
        setUserEmail(session.user.email);
      }
    };

    checkSession();
  }, [supabase, router]);

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }

      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });

      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "There was a problem signing out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!userEmail) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-background">
        <div className="flex h-full flex-col">
          <div className="border-b px-6 py-4">
            <h1 className="text-lg font-semibold">Your App Name</h1>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-4">
            <Link href="/dashboard">
              <Button
                variant="ghost"
                className="w-full justify-start"
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link href="/dashboard/users">
              <Button
                variant="ghost"
                className="w-full justify-start"
              >
                <Users className="mr-2 h-4 w-4" />
                Users
              </Button>
            </Link>
            <Link href="/dashboard/settings">
              <Button
                variant="ghost"
                className="w-full justify-start"
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </Link>
          </nav>

          <div className="border-t p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="ml-3">
                  <p className="text-sm font-medium">
                    {userEmail}
                  </p>
                </div>
              </div>
              <Button
                onClick={handleSignOut}
                variant="ghost"
                size="icon"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LogOut className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </aside>

      <main className="pl-64">
        <div className="h-full py-12">
          {children}
        </div>
      </main>
    </div>
  );
}
```

### app/dashboard/page.tsx

```typescript
import { createServerClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, UserX } from "lucide-react";

export default async function DashboardPage() {
  const supabase = createServerClient();

  // Fetch user stats
  const { data: users } = await supabase
    .from('users')
    .select('*');

  const totalUsers = users?.length || 0;
  const activeUsers = users?.filter(user => user.active)?.length || 0;
  const inactiveUsers = totalUsers - activeUsers;

  const stats = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: Users,
      description: "Total registered users",
    },
    {
      title: "Active Users",
      value: activeUsers,
      icon: UserCheck,
      description: "Users with active accounts",
    },
    {
      title: "Inactive Users",
      value: inactiveUsers,
      icon: UserX,
      description: "Users with inactive accounts",
    },
  ];

  return (
    <div className="container">
      <h1 className="mb-8 text-3xl font-bold">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity or Additional Content */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No recent activity to display.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

### app/dashboard/users/page.tsx

```typescript

import { createServerClient } from "@/lib/supabase/server";
import { UsersTable } from "@/components/users/users-table";
import InviteUser from "@/components/users/invite-user";

export default async function UsersPage() {
  const supabase = createServerClient();

  const { data: users, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error:", error);
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground">Manage your users here.</p>
        </div>
        <InviteUser />
      </div>
      <UsersTable initialData={users || []} />
    </div>
  );
}
```

### app/dashboard/images/page.tsx

```typescript

```

### app/fonts/GeistMonoVF.woff

```woff
Error reading file: 'utf-8' codec can't decode byte 0xee in position 18: invalid continuation byte
```

### app/fonts/GeistVF.woff

```woff
Error reading file: 'utf-8' codec can't decode byte 0xdc in position 11: invalid continuation byte
```

### app/(auth)/layout.tsx

```typescript
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}
```

### app/(auth)/invite/page.tsx

```typescript
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { InviteForm } from "@/components/auth/invite-form";

export const metadata: Metadata = {
  title: "Accept Invitation | Data Management App",
  description: "Accept your invitation and create an account",
};

export default async function InvitePage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const supabase = createServerComponentClient({ cookies });
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/dashboard");
  }

  if (!searchParams.token) {
    redirect("/login");
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome to the team
          </h1>
          <p className="text-sm text-muted-foreground">
            Complete your account setup to get started
          </p>
        </div>
        <InviteForm token={searchParams.token} />
      </div>
    </div>
  );
}
```

### app/(auth)/login/page.tsx

```typescript
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login | Data Management App",
  description: "Login to your account",
};

export default async function LoginPage() {
  const supabase = createServerComponentClient({ cookies });
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="relative z-20 flex items-center text-lg font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          Data Management App
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;This platform has transformed how we handle our data operations, making it both efficient and secure.&rdquo;
            </p>
            <footer className="text-sm">Sofia Davis</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email to sign in to your account
            </p>
          </div>
          <LoginForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            <Link
              href="/signup"
              className="hover:text-brand underline underline-offset-4"
            >
              Don&apos;t have an account? Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
```

### app/(auth)/signup/page.tsx

```typescript
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { SignUpForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Sign Up | Data Management App",
  description: "Create a new account",
};

export default async function SignUpPage() {
  const supabase = createServerComponentClient({ cookies });
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="relative z-20 flex items-center text-lg font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          Data Management App
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;Join our platform to streamline your data management process with powerful tools and intuitive interfaces.&rdquo;
            </p>
            <footer className="text-sm">Alex Thompson</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email below to create your account
            </p>
          </div>
          <SignUpForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            <Link
              href="/login"
              className="hover:text-brand underline underline-offset-4"
            >
              Already have an account? Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
```

### app/api/auth/callback/route.ts

```typescript
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { Database } from "@/lib/supabase/client";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });
    
    // Exchange the code for a session
    await supabase.auth.exchangeCodeForSession(code);
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL("/dashboard", request.url));
}

export const dynamic = "force-dynamic";
```

### app/api/auth/signout/route.ts

```typescript
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  // Sign out the user
  await supabase.auth.signOut();

  // Redirect to login page
  return NextResponse.redirect(new URL("/login", request.url));
}
```

### public/file.svg

```svg
<svg fill="none" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M14.5 13.5V5.41a1 1 0 0 0-.3-.7L9.8.29A1 1 0 0 0 9.08 0H1.5v13.5A2.5 2.5 0 0 0 4 16h8a2.5 2.5 0 0 0 2.5-2.5m-1.5 0v-7H8v-5H3v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1M9.5 5V2.12L12.38 5zM5.13 5h-.62v1.25h2.12V5zm-.62 3h7.12v1.25H4.5zm.62 3h-.62v1.25h7.12V11z" clip-rule="evenodd" fill="#666" fill-rule="evenodd"/></svg>
```

### public/globe.svg

```svg
<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><g clip-path="url(#a)"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.27 14.1a6.5 6.5 0 0 0 3.67-3.45q-1.24.21-2.7.34-.31 1.83-.97 3.1M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.48-1.52a7 7 0 0 1-.96 0H7.5a4 4 0 0 1-.84-1.32q-.38-.89-.63-2.08a40 40 0 0 0 3.92 0q-.25 1.2-.63 2.08a4 4 0 0 1-.84 1.31zm2.94-4.76q1.66-.15 2.95-.43a7 7 0 0 0 0-2.58q-1.3-.27-2.95-.43a18 18 0 0 1 0 3.44m-1.27-3.54a17 17 0 0 1 0 3.64 39 39 0 0 1-4.3 0 17 17 0 0 1 0-3.64 39 39 0 0 1 4.3 0m1.1-1.17q1.45.13 2.69.34a6.5 6.5 0 0 0-3.67-3.44q.65 1.26.98 3.1M8.48 1.5l.01.02q.41.37.84 1.31.38.89.63 2.08a40 40 0 0 0-3.92 0q.25-1.2.63-2.08a4 4 0 0 1 .85-1.32 7 7 0 0 1 .96 0m-2.75.4a6.5 6.5 0 0 0-3.67 3.44 29 29 0 0 1 2.7-.34q.31-1.83.97-3.1M4.58 6.28q-1.66.16-2.95.43a7 7 0 0 0 0 2.58q1.3.27 2.95.43a18 18 0 0 1 0-3.44m.17 4.71q-1.45-.12-2.69-.34a6.5 6.5 0 0 0 3.67 3.44q-.65-1.27-.98-3.1" fill="#666"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h16v16H0z"/></clipPath></defs></svg>
```

### public/next.svg

```svg
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 394 80"><path fill="#000" d="M262 0h68.5v12.7h-27.2v66.6h-13.6V12.7H262V0ZM149 0v12.7H94v20.4h44.3v12.6H94v21h55v12.6H80.5V0h68.7zm34.3 0h-17.8l63.8 79.4h17.9l-32-39.7 32-39.6h-17.9l-23 28.6-23-28.6zm18.3 56.7-9-11-27.1 33.7h17.8l18.3-22.7z"/><path fill="#000" d="M81 79.3 17 0H0v79.3h13.6V17l50.2 62.3H81Zm252.6-.4c-1 0-1.8-.4-2.5-1s-1.1-1.6-1.1-2.6.3-1.8 1-2.5 1.6-1 2.6-1 1.8.3 2.5 1a3.4 3.4 0 0 1 .6 4.3 3.7 3.7 0 0 1-3 1.8zm23.2-33.5h6v23.3c0 2.1-.4 4-1.3 5.5a9.1 9.1 0 0 1-3.8 3.5c-1.6.8-3.5 1.3-5.7 1.3-2 0-3.7-.4-5.3-1s-2.8-1.8-3.7-3.2c-.9-1.3-1.4-3-1.4-5h6c.1.8.3 1.6.7 2.2s1 1.2 1.6 1.5c.7.4 1.5.5 2.4.5 1 0 1.8-.2 2.4-.6a4 4 0 0 0 1.6-1.8c.3-.8.5-1.8.5-3V45.5zm30.9 9.1a4.4 4.4 0 0 0-2-3.3 7.5 7.5 0 0 0-4.3-1.1c-1.3 0-2.4.2-3.3.5-.9.4-1.6 1-2 1.6a3.5 3.5 0 0 0-.3 4c.3.5.7.9 1.3 1.2l1.8 1 2 .5 3.2.8c1.3.3 2.5.7 3.7 1.2a13 13 0 0 1 3.2 1.8 8.1 8.1 0 0 1 3 6.5c0 2-.5 3.7-1.5 5.1a10 10 0 0 1-4.4 3.5c-1.8.8-4.1 1.2-6.8 1.2-2.6 0-4.9-.4-6.8-1.2-2-.8-3.4-2-4.5-3.5a10 10 0 0 1-1.7-5.6h6a5 5 0 0 0 3.5 4.6c1 .4 2.2.6 3.4.6 1.3 0 2.5-.2 3.5-.6 1-.4 1.8-1 2.4-1.7a4 4 0 0 0 .8-2.4c0-.9-.2-1.6-.7-2.2a11 11 0 0 0-2.1-1.4l-3.2-1-3.8-1c-2.8-.7-5-1.7-6.6-3.2a7.2 7.2 0 0 1-2.4-5.7 8 8 0 0 1 1.7-5 10 10 0 0 1 4.3-3.5c2-.8 4-1.2 6.4-1.2 2.3 0 4.4.4 6.2 1.2 1.8.8 3.2 2 4.3 3.4 1 1.4 1.5 3 1.5 5h-5.8z"/></svg>
```

### public/vercel.svg

```svg
<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1155 1000"><path d="m577.3 0 577.4 1000H0z" fill="#fff"/></svg>
```

### public/window.svg

```svg
<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.5 2.5h13v10a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1zM0 1h16v11.5a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 0 12.5zm3.75 4.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M7 4.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m1.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5" fill="#666"/></svg>
```

### src/lib/utils.ts

```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### src/lib/supabase/client.ts

```typescript
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          role: string;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          email: string;
          role?: string;
          active?: boolean;
        };
        Update: {
          name?: string;
          email?: string;
          role?: string;
          active?: boolean;
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          user_id: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          full_name?: string | null;
          avatar_url?: string | null;
        };
        Update: {
          user_id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
      };
      data_entries: {
        Row: {
          id: string;
          title: string;
          content: string;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          title: string;
          content: string;
          user_id: string;
        };
        Update: {
          title?: string;
          content?: string;
          user_id?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
};

// Helper Types
export type Tables = Database['public']['Tables'];
export type TableRow<T extends keyof Tables> = Tables[T]['Row'];

export type DbUser = TableRow<'users'>;
export type DbProfile = TableRow<'profiles'>;
export type DbDataEntry = TableRow<'data_entries'>;

export interface DbDataEntryWithUser extends DbDataEntry {
  user: DbUser;
}

// Create a singleton instance
let client: ReturnType<typeof createClientComponentClient<Database>>;

export const getSupabaseClient = () => {
  if (!client) {
    client = createClientComponentClient<Database>();
  }
  return client;
};
```

### src/lib/supabase/server.ts

```typescript
import { createServerComponentClient, createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { cache } from "react";
import type { Database, DbDataEntryWithUser } from "./client";

// Cached server component client
export const createServerClient = cache(() => {
  const cookieStore = cookies();
  return createServerComponentClient<Database>({ cookies: () => cookieStore });
});

// Server action client (for use in Server Actions)
export const createActionClient = () => {
  const cookieStore = cookies();
  return createServerActionClient<Database>({ cookies: () => cookieStore });
};

// Cached session getter
export const getSession = cache(async () => {
  const supabase = createServerClient();
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
});

// User profile getter with error handling
export const getUserProfile = cache(async () => {
  const session = await getSession();
  if (!session?.user.id) return null;

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('profiles')
    .select()
    .eq('user_id', session.user.id)
    .single();

  if (error) {
    console.error("Error:", error);
    return null;
  }

  return data;
});

// Data entries getter with pagination and error handling
export async function getDataEntries(page = 1, limit = 10) {
  const supabase = createServerClient();
  const start = (page - 1) * limit;
  const end = start + limit - 1;

  try {
    const { data, error, count } = await supabase
      .from('data_entries')
      .select(`
        *,
        user:users!inner(*)
      `)
      .order('created_at', { ascending: false })
      .range(start, end);

    if (error) throw error;

    return {
      data: data as unknown as DbDataEntryWithUser[],
      count: count || 0
    };
  } catch (error) {
    console.error("Error:", error);
    return { data: [], count: 0 };
  }
}

// Protected route session checker
export async function checkSession() {
  const session = await getSession();
  return !!session;
}
```

### src/lib/supabase/types.ts

```typescript
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          role: string;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          email: string;
          role?: string;
          active?: boolean;
        };
        Update: {
          name?: string;
          email?: string;
          role?: string;
          active?: boolean;
          updated_at?: string;
        };
      };
    };
  };
};

export type Tables<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Row'];

export type User = Tables<'users'>;
```

### src/components/ui/alert-dialog.tsx

```typescript
import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

const AlertDialog = AlertDialogPrimitive.Root

const AlertDialogTrigger = AlertDialogPrimitive.Trigger

const AlertDialogPortal = AlertDialogPrimitive.Portal

const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
))
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    />
  </AlertDialogPortal>
))
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName

const AlertDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
AlertDialogHeader.displayName = "AlertDialogHeader"

const AlertDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
AlertDialogFooter.displayName = "AlertDialogFooter"

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold", className)}
    {...props}
  />
))
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
AlertDialogDescription.displayName =
  AlertDialogPrimitive.Description.displayName

const AlertDialogAction = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(buttonVariants(), className)}
    {...props}
  />
))
AlertDialogAction.displayName = "AlertDialogAction"

const AlertDialogCancel = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      buttonVariants({ variant: "outline" }),
      "mt-2 sm:mt-0",
      className
    )}
    {...props}
  />
))
AlertDialogCancel.displayName = "AlertDialogCancel"

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}
```

### src/components/ui/button.tsx

```typescript
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

```

### src/components/ui/card.tsx

```typescript
import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-card text-card-foreground shadow",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }

```

### src/components/ui/dialog.tsx

```typescript
import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}

```

### src/components/ui/dropdown-menu.tsx

```typescript
import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "@/lib/utils"

const DropdownMenu = DropdownMenuPrimitive.Root

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

const DropdownMenuGroup = DropdownMenuPrimitive.Group

const DropdownMenuPortal = DropdownMenuPrimitive.Portal

const DropdownMenuSub = DropdownMenuPrimitive.Sub

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto" />
  </DropdownMenuPrimitive.SubTrigger>
))
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
))
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
      {...props}
    />
  )
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
}

```

### src/components/ui/form.tsx

```typescript
import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext,
} from "react-hook-form"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

const Form = FormProvider

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()

  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
)

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  )
})
FormItem.displayName = "FormItem"

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField()

  return (
    <Label
      ref={ref}
      className={cn(error && "text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  )
})
FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  )
})
FormControl.displayName = "FormControl"

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField()

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
})
FormDescription.displayName = "FormDescription"

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message) : children

  if (!body) {
    return null
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  )
})
FormMessage.displayName = "FormMessage"

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
}
```

### src/components/ui/input.tsx

```typescript
import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }

```

### src/components/ui/label.tsx

```typescript
"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
```

### src/components/ui/table.tsx

```typescript
import * as React from "react"

import { cn } from "@/lib/utils"

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    )}
    {...props}
  />
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}

```

### src/components/ui/toast.tsx

```typescript
import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-2 overflow-hidden rounded-md border p-4 pr-6 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive:
          "destructive group border-destructive bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors hover:bg-secondary focus:outline-none focus:ring-1 focus:ring-ring disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-1 top-1 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-1 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold [&+div]:text-xs", className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}

```

### src/components/ui/toaster.tsx

```typescript
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"  // Changed this import

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
```

### src/components/ui/use-toast.tsx

```typescript
import * as React from "react"
import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

// Changed from const to type
type ActionTypes = {
  ADD_TOAST: "ADD_TOAST"
  UPDATE_TOAST: "UPDATE_TOAST"
  DISMISS_TOAST: "DISMISS_TOAST"
  REMOVE_TOAST: "REMOVE_TOAST"
}

const ACTION_TYPES: ActionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
}

type Action =
  | {
      type: ActionTypes["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionTypes["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionTypes["DISMISS_TOAST"]
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionTypes["REMOVE_TOAST"]
      toastId?: ToasterToast["id"]
    }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }
  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: ACTION_TYPES.REMOVE_TOAST,
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)
  toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ACTION_TYPES.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }
    case ACTION_TYPES.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }
    case ACTION_TYPES.DISMISS_TOAST: {
      const { toastId } = action
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }
    case ACTION_TYPES.REMOVE_TOAST:
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

const listeners: Array<(state: State) => void> = []
let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

type Toast = Omit<ToasterToast, "id">

function toast({ ...props }: Toast) {
  const id = genId()

  const update = (props: ToasterToast) =>
    dispatch({
      type: ACTION_TYPES.UPDATE_TOAST,
      toast: { ...props, id },
    })
  const dismiss = () => dispatch({ type: ACTION_TYPES.DISMISS_TOAST, toastId: id })

  dispatch({
    type: ACTION_TYPES.ADD_TOAST,
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: ACTION_TYPES.DISMISS_TOAST, toastId }),
  }
}

export { useToast, toast }
```

### src/components/data/data-entry.tsx

```typescript
import type { DbDataEntryWithUser } from '@/lib/supabase/client';

interface DataEntryListProps {
  entries: DbDataEntryWithUser[];
}

export function DataEntryList({ entries }: DataEntryListProps) {
  return (
    <div className="space-y-4">
      {entries.map(entry => (
        <div key={entry.id} className="p-4 border rounded-lg">
          <h3 className="text-lg font-semibold">{entry.title}</h3>
          <p className="mt-2 text-gray-600">{entry.content}</p>
          <div className="mt-2 text-sm text-gray-500">
            Created by: {entry.user.name} ({entry.user.email})
          </div>
        </div>
      ))}
    </div>
  );
}
```

### src/components/data/data-management.tsx

```typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data/data-table";
import { EditForm } from "@/components/data/edit-form";
import { useToast } from "../ui/use-toast";
import { Plus } from "lucide-react";

type DataEntry = {
  id: string;
  name: string;
  random_number: number;
  created_at: string;
  updated_at: string;
  updated_by: string;
};

interface DataManagementProps {
  initialData: DataEntry[];
}

export function DataManagement({ initialData }: DataManagementProps) {
  const [data, setData] = useState<DataEntry[]>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DataEntry | null>(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClientComponentClient();

  const handleEdit = (entry: DataEntry) => {
    setEditingEntry(entry);
    setIsEditFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from("data_entries")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setData((prev) => prev.filter((entry) => entry.id !== id));
      toast({
        title: "Entry deleted",
        description: "The entry has been successfully deleted.",
      });
      router.refresh();
    } catch (error) {
      console.error("Error deleting entry:", error);
      toast({
        title: "Error",
        description: "Failed to delete the entry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (formData: { name: string; random_number: number }) => {
    try {
      setIsLoading(true);
      if (editingEntry) {
        // Update existing entry
        const { error } = await supabase
          .from("data_entries")
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingEntry.id);

        if (error) throw error;

        toast({
          title: "Entry updated",
          description: "The entry has been successfully updated.",
        });
      } else {
        // Create new entry
        const { error } = await supabase
          .from("data_entries")
          .insert([
            {
              ...formData,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ]);

        if (error) throw error;

        toast({
          title: "Entry created",
          description: "The new entry has been successfully created.",
        });
      }
      
      router.refresh();
    } catch (error) {
      console.error("Error saving entry:", error);
      toast({
        title: "Error",
        description: "Failed to save the entry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsEditFormOpen(false);
      setEditingEntry(null);
    }
  };

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button
          onClick={() => {
            setEditingEntry(null);
            setIsEditFormOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Entry
        </Button>
      </div>

      <DataTable
        data={data}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <EditForm
        isOpen={isEditFormOpen}
        onClose={() => {
          setIsEditFormOpen(false);
          setEditingEntry(null);
        }}
        onSubmit={handleSubmit}
        initialData={editingEntry || undefined}
        isLoading={isLoading}
      />
    </>
  );
}
```

### src/components/data/data-table.tsx

```typescript
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { TableActions } from "./table-actions";

interface DataEntry {
  id: string;
  name: string;
  random_number: number;
  created_at: string;
  updated_at: string;
  updated_by: string;
}

interface DataTableProps {
  data: DataEntry[];
  isLoading: boolean;
  onEdit: (entry: DataEntry) => void;
  onDelete: (id: string) => void;
}

export function DataTable({ data, isLoading, onEdit, onDelete }: DataTableProps) {
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Random Number</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>{entry.name}</TableCell>
              <TableCell>{entry.random_number}</TableCell>
              <TableCell>
                {new Date(entry.updated_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <TableActions 
                  onEdit={() => onEdit(entry)}
                  onDelete={() => onDelete(entry.id)}
                />
              </TableCell>
            </TableRow>
          ))}
          {data.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                No data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
```

### src/components/data/edit-form.tsx

```typescript
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  random_number: z.coerce
    .number()
    .min(0, {
      message: "Number must be positive.",
    })
    .max(1000000, {
      message: "Number must be less than 1,000,000.",
    }),
});

type FormData = z.infer<typeof formSchema>;

interface EditFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => Promise<void>;
  initialData?: {
    name: string;
    random_number: number;
  };
  isLoading?: boolean;
}

export function EditForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}: EditFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      random_number: 0,
    },
  });

  const handleSubmit = async (data: FormData) => {
    try {
      await onSubmit(data);
      form.reset();
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Entry" : "Create New Entry"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter name" disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="random_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Random Number</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      placeholder="Enter number"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
```

### src/components/data/table-actions.tsx

```typescript
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

interface TableActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export function TableActions({ onEdit, onDelete }: TableActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onEdit}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the data
              entry from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDelete();
                setShowDeleteDialog(false);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
```

### src/components/users/invite-user.tsx

```typescript
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { getSupabaseClient } from "@/lib/supabase/client";
import { Loader2, UserPlus } from "lucide-react";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  role: z.enum(["user", "admin"]).default("user"),
});

type FormData = z.infer<typeof formSchema>;

export default function InviteUser() {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const supabase = getSupabaseClient();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      role: "user",
    },
  });

  const onSubmit = async (values: FormData) => {
    try {
      setIsOpen(false);
      
      // First, check if the user already exists
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id')
        .eq('email', values.email)
        .single();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        throw checkError;
      }

      if (existingUser) {
        toast({
          title: "Error",
          description: "This email is already registered.",
          variant: "destructive",
        });
        return;
      }

      // Send the invitation
      const { error: inviteError } = await supabase.auth.admin.inviteUserByEmail(values.email, {
        data: {
          role: values.role,
        },
      });

      if (inviteError) throw inviteError;

      // Create user record
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          email: values.email,
          role: values.role,
          name: values.email.split('@')[0], // Temporary name from email
          active: false, // Will be activated when user accepts invitation
        });

      if (insertError) throw insertError;

      toast({
        title: "Success",
        description: "Invitation sent successfully.",
      });
      
      form.reset();
    } catch (error: unknown) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send invitation.",
        variant: "destructive",
      });
      
      // Reopen the dialog if there was an error
      setIsOpen(true);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Invite User
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite New User</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter email address" 
                      type="email"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      {...field}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Invitation"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
```

### src/components/users/users-table.tsx

```typescript
"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database, DbUser } from "@/lib/supabase/client";

interface UsersTableProps {
  initialData: DbUser[];
}

export function UsersTable({ initialData }: UsersTableProps) {
  const [users, setUsers] = useState<DbUser[]>(initialData);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const { toast } = useToast();
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const channel = supabase.channel('users_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'users'
      }, (payload) => {
        console.log('Change received:', payload);
        
        if (payload.eventType === 'UPDATE') {
          const updatedUser = payload.new as DbUser;
          setUsers(currentUsers => 
            currentUsers.map(user => 
              user.id === updatedUser.id ? updatedUser : user
            )
          );
        }
      })
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const handleStatusChange = async (userId: string, active: boolean) => {
    try {
      setIsLoading(userId);

      const { error } = await supabase
        .from('users')
        .update({ 
          active,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      // Optimistic update
      setUsers(currentUsers => 
        currentUsers.map(user => 
          user.id === userId ? { ...user, active } : user
        )
      );

      toast({
        title: "Success",
        description: `User ${active ? 'activated' : 'deactivated'} successfully.`,
      });

    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to update user status.",
        variant: "destructive",
      });
      
      // Revert optimistic update on error
      setUsers(currentUsers => [...currentUsers]);
    } finally {
      setIsLoading(null);
    }
  };

  // Rest of your component remains the same...

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell className="capitalize">{user.role}</TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.active
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {user.active ? "Active" : "Inactive"}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      {isLoading === user.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <MoreHorizontal className="h-4 w-4" />
                      )}
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => handleStatusChange(user.id, !user.active)}
                      disabled={isLoading === user.id}
                    >
                      Mark as {user.active ? "Inactive" : "Active"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
```

### src/components/image/ImageUpload.tsx

```typescript
// src/components/image/ImageUpload.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { ImageUploadProps, FilePreview } from './types';
import { validateFile, generateFileName } from './utils';

export const ImageUpload: React.FC<ImageUploadProps> = ({
  category,
  itemName,
  onUploadComplete,
  onError
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FilePreview | null>(null);

  // Handle file selection
  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = validateFile(file);
    if (!validation.isValid) {
      onError(validation.error || 'Error de validación');
      return;
    }

    setSelectedFile({
      file,
      preview: URL.createObjectURL(file)
    });
  }, [onError]);

  // Handle upload
  const handleUpload = async () => {
    if (!selectedFile) {
      onError('Por favor, seleccione una imagen');
      return;
    }

    setIsUploading(true);

    try {
      const fileName = generateFileName(itemName, selectedFile.file.name);
      const filePath = `${category}/${fileName}`;

      const { data, error } = await supabase.storage
        .from('menu-images')
        .upload(filePath, selectedFile.file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('menu-images')
        .getPublicUrl(filePath);

      onUploadComplete(publicUrl);
      setSelectedFile(null);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Error al subir la imagen');
    } finally {
      setIsUploading(false);
    }
  };

  // Clear selected file
  const handleClear = useCallback(() => {
    if (selectedFile) {
      URL.revokeObjectURL(selectedFile.preview);
      setSelectedFile(null);
    }
  }, [selectedFile]);

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (selectedFile) {
        URL.revokeObjectURL(selectedFile.preview);
      }
    };
  }, [selectedFile]);

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <div className="space-y-4">
        {/* File Input */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Seleccionar Imagen
          </label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileSelect}
            disabled={isUploading}
            className="block w-full text-sm text-gray-500
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-md file:border-0
                     file:text-sm file:font-medium
                     file:bg-blue-50 file:text-blue-700
                     hover:file:bg-blue-100"
          />
        </div>

        {/* Preview */}
        {selectedFile && (
          <div className="mt-4">
            <p className="text-sm text-gray-500 mb-2">Vista previa:</p>
            <div className="relative w-48 h-48 rounded-lg overflow-hidden group">
              <img
                src={selectedFile.preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <button
                onClick={handleClear}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 
                         group-hover:opacity-100 transition-opacity"
              >
                <svg xmlns="http://www.w3.org/2000/svg" 
                     className="h-4 w-4" 
                     viewBox="0 0 20 20" 
                     fill="currentColor">
                  <path fillRule="evenodd" 
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
                        clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium
                     ${!selectedFile || isUploading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
            } transition-colors`}
        >
          {isUploading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                   xmlns="http://www.w3.org/2000/svg" 
                   fill="none" 
                   viewBox="0 0 24 24">
                <circle className="opacity-25" 
                        cx="12" 
                        cy="12" 
                        r="10" 
                        stroke="currentColor" 
                        strokeWidth="4" />
                <path className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Subiendo...
            </span>
          ) : (
            'Subir Imagen'
          )}
        </button>
      </div>
    </div>
  );
};

export default ImageUpload;
```

### src/components/image/types.ts

```typescript
// src/components/image/types.ts
import { Database } from '@/lib/supabase/types';

export type MenuCategory = 
  | 'arroces' 
  | 'carnes' 
  | 'del-huerto' 
  | 'del-mar' 
  | 'para-compartir' 
  | 'para-peques' 
  | 'para-veganos' 
  | 'postres';

export interface FilePreview {
  file: File;
  preview: string;
}

export interface ImageUploadProps {
  category: MenuCategory;
  itemName: string;
  onUploadComplete: (url: string) => void;
  onError: (error: string) => void;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}
```

### src/components/image/utils.ts

```typescript
// src/components/image/utils.ts
import { ValidationResult } from './types';

export const validateFile = (file: File): ValidationResult => {
  // Check file type
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Solo se permiten archivos JPG, PNG o WebP'
    };
  }

  // Check file size (2MB max)
  const maxSize = 2 * 1024 * 1024;
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'El archivo es demasiado grande. El tamaño máximo es 2MB'
    };
  }

  return { isValid: true };
};

export const generateFileName = (itemName: string, originalName: string): string => {
  const extension = originalName.split('.').pop()?.toLowerCase() || 'jpg';
  const cleanName = itemName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')  // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '')     // Remove special characters
    .trim()
    .replace(/\s+/g, '-');            // Replace spaces with hyphens

  const timestamp = Date.now();
  return `${cleanName}-${timestamp}.${extension}`;
};
```

### src/components/auth/invite-form.tsx

```typescript
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

interface InviteFormProps {
  token: string;
}

export function InviteForm({ token }: InviteFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClientComponentClient();
  const [isVerifying, setIsVerifying] = React.useState(true);

  // Verify the invite token when component mounts
  React.useEffect(() => {
    async function verifyInviteToken() {
      try {
        // Verify the token with Supabase
        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'invite',
        });

        if (error) {
          throw error;
        }

        setIsVerifying(false);
      } catch (error) {
        console.error('Error verifying invite:', error);
        toast({
          title: "Invalid Invitation",
          description: "This invitation link is invalid or has expired.",
          variant: "destructive",
        });
        router.push('/login');
      }
    }

    verifyInviteToken();
  }, [token, router, supabase.auth, toast]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Accept the invitation and set the password
      const { error } = await supabase.auth.updateUser({
        password: values.password,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Your account has been set up successfully.",
      });

      router.push("/dashboard");
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isVerifying) {
    return (
      <div className="flex items-center justify-center space-x-2">
        <Loader2 className="h-6 w-6 animate-spin" />
        <p>Verifying invitation...</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="Create a password" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="Confirm your password" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button 
          type="submit" 
          className="w-full" 
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Setting up account...
            </>
          ) : (
            "Complete setup"
          )}
        </Button>
      </form>
    </Form>
  );
}
```

### src/components/auth/login-form.tsx

```typescript
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClientComponentClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "You have been logged in successfully.",
      });

      router.refresh();
      router.push("/dashboard");
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input 
                  type="email" 
                  placeholder="Enter your email" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="Enter your password" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button 
          type="submit" 
          className="w-full" 
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>
    </Form>
  );
}
```

### src/components/auth/signup-form.tsx

```typescript
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export function SignUpForm() {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClientComponentClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Please check your email to confirm your account.",
      });

      router.push("/login");
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input 
                  type="email" 
                  placeholder="Enter your email" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="Create a password" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="Confirm your password" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button 
          type="submit" 
          className="w-full" 
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </Button>
      </form>
    </Form>
  );
}
```

