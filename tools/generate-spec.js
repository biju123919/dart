#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Get command line arguments
const args = process.argv.slice(2);
const type = args[0]; 
const name = args[1];
const targetPath = args[2] || '';

if (!type || !name) {
  console.log('Usage: node generate-spec.js <type> <name> [path]');
  console.log('Example: node generate-spec.js component reports components/reports');
  process.exit(1);
}

// Helper functions for path construction
function buildImportPath(targetPath, name, type) {
  const basePath = '../../app/';
  const pathSegment = targetPath ? `${targetPath}/` : '';
  
  switch (type) {
    case 'component':
      return `${basePath}${pathSegment}${name}/${name}.component`;
    case 'service':
      return `${basePath}${pathSegment}${name}.service`;
    case 'pipe':
      return `${basePath}${pathSegment}${name}.pipe`;
    case 'directive':
      return `${basePath}${pathSegment}${name}.directive`;
    default:
      return `${basePath}${pathSegment}${name}`;
  }
}

function toPascalCase(str) {
  return str.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join('');
}

// Templates with cleaner structure
const templates = {
  component: (name, className) => {
    const importPath = buildImportPath(targetPath, name, 'component');
    return `import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ${className}Component } from '${importPath}';

describe('${className}Component', () => {
  let component: ${className}Component;
  let fixture: ComponentFixture<${className}Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [${className}Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(${className}Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});`;
  },

  service: (name, className) => {
    const importPath = buildImportPath(targetPath, name, 'service');
    return `import { TestBed } from '@angular/core/testing';
import { ${className}Service } from '${importPath}';

describe('${className}Service', () => {
  let service: ${className}Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(${className}Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});`;
  },

  pipe: (name, className) => {
    const importPath = buildImportPath(targetPath, name, 'pipe');
    return `import { ${className}Pipe } from '${importPath}';

describe('${className}Pipe', () => {
  it('create an instance', () => {
    const pipe = new ${className}Pipe();
    expect(pipe).toBeTruthy();
  });
});`;
  },

  directive: (name, className) => {
    const importPath = buildImportPath(targetPath, name, 'directive');
    return `import { ${className}Directive } from '${importPath}';

describe('${className}Directive', () => {
  it('should create an instance', () => {
    const directive = new ${className}Directive();
    expect(directive).toBeTruthy();
  });
});`;
  }
};

// Generate spec content
const className = toPascalCase(name);
const template = templates[type];

if (!template) {
  console.error(`Unknown type: ${type}. Supported types: component, service, pipe, directive`);
  process.exit(1);
}

const specContent = template(name, className);

// Create directory structure
const specDir = path.join('src', 'tests', `${type}s`, targetPath || name);
const specFile = path.join(specDir, `${name}.${type}.spec.ts`);

// Ensure directory exists
fs.mkdirSync(specDir, { recursive: true });

// Write spec file
fs.writeFileSync(specFile, specContent);