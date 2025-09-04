#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';

interface HomepageSection {
  name: string;
  component: string;
  status: 'implemented' | 'missing' | 'needs-update';
  figmaNodeId?: string;
  designTokens: string[];
  violations: string[];
  recommendations: string[];
}

interface HomepageAnalysis {
  sections: HomepageSection[];
  totalViolations: number;
  missingComponents: string[];
  designTokenIssues: string[];
  implementationScore: number;
}

// Figma design tokens from the API response
const FIGMA_DESIGN_TOKENS = {
  colors: {
    'Surface/Neutral/page': '#f9fafa',
    'Surface/Neutral/inverse': '#252626',
    'Surface/Neutral/elevated': '#e8eaea',
    'Surface/Primary/default': '#f0f081',
    'Text/Neutral/display': '#0c0d0d',
    'Text/Neutral/inverse': '#f9fafa',
    'Text/Neutral/heading': '#252626',
    'Text/Neutral/subtle-inverse': '#f1f2f2',
    'Text/Neutral/disabled': '#bbbfbf',
    'Color/text/default/default': '#1c1917',
    'Border/Neutral/dark': '#252626',
    'Border/Neutral/inverse-subtle': '#f1f2f2',
    'Icon/Neutral/display': '#0c0d0d',
    'Icon/Neutral/display-inverse': '#f9fafa',
    'color/Opacity/pink/80': '#f0aaf0cc'
  },
  typography: {
    'font family/display': 'Behind The Nineties',
    'font family/heading': 'Behind The Nineties',
    'font family/title': 'Overused Grotesk',
    'font family/body': 'Overused Grotesk',
    'fontsize/display/display': '128px',
    'fontsize/heading/H1': '96px',
    'fontsize/heading/H2': '72px',
    'fontsize/heading/H3': '60px',
    'fontsize/heading/H4': '48px',
    'fontsize/title/xl': '60px',
    'fontsize/title/lg': '48px',
    'fontsize/title/md': '36px',
    'fontsize/title/sm': '30px',
    'fontsize/title/xs': '24px',
    'fontsize/body/lg': '18px',
    'fontsize/body/sm': '14px',
    'lineheight/display/display': '136px',
    'lineheight/heading/H1': '128px',
    'lineheight/heading/H2': '96px',
    'lineheight/heading/H3': '72px',
    'lineheight/heading/H4': '60px',
    'lineheight/title/xl': '72px',
    'lineheight/title/lg': '60px',
    'lineheight/title/base': '48px',
    'lineheight/title/sm': '40px',
    'lineheight/title/xs': '32px',
    'lineheight/body/lg': '24px',
    'lineheight/body/sm': '20px'
  },
  spacing: {
    'margins': '96px',
    'spacing/lg': '48px',
    'spacing/md': '24px',
    'spacing/sm': '12px',
    'spacing/2': '8px',
    'spacing/4': '16px',
    'gutter': '24px'
  },
  layout: {
    'breakpoint': '1440px',
    'columns': '12',
    'radius/xl': '8px',
    'Button/Radius': '6px'
  }
};

// Wireframe specification from the cursor rules
const WIREFRAME_SPEC = {
  sections: [
    {
      name: 'Logo Section',
      component: 'CTA variant="logo"',
      figmaNodeId: '701_50574',
      requiredTokens: ['Surface/Neutral/page', 'spacing/lg', 'spacing/md']
    },
    {
      name: 'Navigation Bar',
      component: 'NavBar currentPage="home"',
      figmaNodeId: '701_50575',
      requiredTokens: ['Surface/Neutral/page', 'Border/Neutral/dark', 'font family/title', 'fontsize/title/xs']
    },
    {
      name: 'Page Header',
      component: 'PageTitle text="Hello Bendy Friends!"',
      figmaNodeId: '701_50576',
      requiredTokens: ['Surface/Neutral/inverse', 'Text/Neutral/inverse', 'font family/display', 'fontsize/display/display']
    },
    {
      name: 'Hero Section',
      component: 'HeroSection',
      figmaNodeId: '959_45252',
      requiredTokens: ['Surface/Primary/default', 'font family/display', 'font family/body', 'spacing/lg']
    },
    {
      name: 'Copy Block Section',
      component: 'CopyBlock',
      figmaNodeId: '701_50588',
      requiredTokens: ['Surface/Neutral/page', 'Text/Neutral/heading', 'spacing/lg', 'font family/heading']
    },
    {
      name: 'Story CTA Section',
      component: 'CTA variant="text"',
      figmaNodeId: '701_50595',
      requiredTokens: ['Surface/Neutral/page', 'Text/Neutral/display', 'font family/display']
    },
    {
      name: 'Image Gallery Section',
      component: 'ImageGallery',
      figmaNodeId: '814_10962',
      requiredTokens: ['Surface/Neutral/elevated', 'spacing/md', 'radius/xl']
    },
    {
      name: 'Feature Cards Section',
      component: 'FeatureCardGrid',
      figmaNodeId: '827_11141',
      requiredTokens: ['color/Opacity/pink/80', 'font family/heading', 'font family/body', 'spacing/lg']
    },
    {
      name: 'Social Feed Preview Section',
      component: 'SocialFeedPreview',
      figmaNodeId: '701_50598',
      requiredTokens: ['Surface/Primary/default', 'Text/Neutral/display', 'font family/display']
    },
    {
      name: 'Footer Section',
      component: 'Footer variant="desktop"',
      figmaNodeId: '701_50599',
      requiredTokens: ['Surface/Neutral/inverse', 'Text/Neutral/inverse', 'spacing/md']
    }
  ]
};

// Check if component exists
function componentExists(componentName: string): boolean {
  const componentPath = path.join(process.cwd(), 'app', 'components', 'ui', `${componentName}.tsx`);
  return fs.existsSync(componentPath);
}

// Check if component uses design tokens
function checkDesignTokenUsage(componentPath: string): { violations: string[], tokens: string[] } {
  if (!fs.existsSync(componentPath)) {
    return { violations: ['Component file not found'], tokens: [] };
  }

  const content = fs.readFileSync(componentPath, 'utf8');
  const violations: string[] = [];
  const tokens: string[] = [];

  // Check for hardcoded values
  const hardcodedPatterns = [
    /#[0-9a-fA-F]{3,6}/g, // Hex colors
    /\d+px/g, // Pixel values
    /bg-\w+-\d+/g, // Tailwind classes
    /text-\w+-\d+/g, // Tailwind text classes
    /p-\d+/g, // Tailwind padding
    /m-\d+/g, // Tailwind margin
    /style=\{\{[^}]*\}\}/g // Inline styles
  ];

  hardcodedPatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      violations.push(`Found hardcoded values: ${matches.join(', ')}`);
    }
  });

  // Check for design token usage
  const tokenPatterns = [
    /var\(--[^)]+\)/g, // CSS custom properties
    /className="[^"]*bg-surface[^"]*"/g, // Surface classes
    /className="[^"]*text-text[^"]*"/g, // Text classes
    /className="[^"]*spacing-[^"]*"/g // Spacing classes
  ];

  tokenPatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      tokens.push(...matches);
    }
  });

  return { violations, tokens };
}

// Analyze homepage implementation
function analyzeHomepage(): HomepageAnalysis {
  console.log('🏠 Analyzing Homepage Implementation...\n');

  const sections: HomepageSection[] = [];
  let totalViolations = 0;
  const missingComponents: string[] = [];
  const designTokenIssues: string[] = [];

  // Check current homepage implementation
  const homepagePath = path.join(process.cwd(), 'app', 'page.tsx');
  const homepageExists = fs.existsSync(homepagePath);
  
  if (!homepageExists) {
    console.log('❌ Homepage file not found at app/page.tsx');
    return {
      sections: [],
      totalViolations: 0,
      missingComponents: ['Homepage implementation'],
      designTokenIssues: ['No homepage file found'],
      implementationScore: 0
    };
  }

  // Analyze each section
  WIREFRAME_SPEC.sections.forEach(spec => {
    const section: HomepageSection = {
      name: spec.name,
      component: spec.component,
      status: 'missing',
      figmaNodeId: spec.figmaNodeId,
      designTokens: [],
      violations: [],
      recommendations: []
    };

    // Extract component name from spec
    const componentName = spec.component.split(' ')[0];
    
    // Check if component exists
    if (componentExists(componentName)) {
      const componentPath = path.join(process.cwd(), 'app', 'components', 'ui', `${componentName}.tsx`);
      const { violations, tokens } = checkDesignTokenUsage(componentPath);
      
      section.status = violations.length > 0 ? 'needs-update' : 'implemented';
      section.violations = violations;
      section.designTokens = tokens;
      totalViolations += violations.length;

      if (violations.length > 0) {
        designTokenIssues.push(`${componentName}: ${violations.length} violations`);
      }
    } else {
      section.status = 'missing';
      missingComponents.push(componentName);
      section.recommendations.push(`Create ${componentName} component`);
    }

    // Check if homepage uses this component
    const homepageContent = fs.readFileSync(homepagePath, 'utf8');
    if (!homepageContent.includes(componentName)) {
      section.recommendations.push(`Add ${componentName} to homepage`);
    }

    sections.push(section);
  });

  // Calculate implementation score
  const implementedSections = sections.filter(s => s.status === 'implemented').length;
  const implementationScore = (implementedSections / sections.length) * 100;

  return {
    sections,
    totalViolations,
    missingComponents,
    designTokenIssues,
    implementationScore
  };
}

// Generate implementation plan
function generateImplementationPlan(analysis: HomepageAnalysis): string {
  let plan = '# 🏠 Homepage Implementation Plan\n\n';
  
  plan += `## 📊 Current Status\n`;
  plan += `- **Implementation Score**: ${analysis.implementationScore.toFixed(1)}%\n`;
  plan += `- **Total Violations**: ${analysis.totalViolations}\n`;
  plan += `- **Missing Components**: ${analysis.missingComponents.length}\n\n`;

  plan += `## 🎯 Section-by-Section Analysis\n\n`;

  analysis.sections.forEach(section => {
    const statusIcon = section.status === 'implemented' ? '✅' : 
                      section.status === 'needs-update' ? '⚠️' : '❌';
    
    plan += `### ${statusIcon} ${section.name}\n`;
    plan += `- **Component**: \`${section.component}\`\n`;
    plan += `- **Status**: ${section.status}\n`;
    
    if (section.figmaNodeId) {
      plan += `- **Figma Node**: ${section.figmaNodeId}\n`;
    }
    
    if (section.violations.length > 0) {
      plan += `- **Violations**: ${section.violations.length}\n`;
      section.violations.forEach(violation => {
        plan += `  - ${violation}\n`;
      });
    }
    
    if (section.recommendations.length > 0) {
      plan += `- **Recommendations**:\n`;
      section.recommendations.forEach(rec => {
        plan += `  - ${rec}\n`;
      });
    }
    
    plan += '\n';
  });

  plan += `## 🚀 Implementation Priority\n\n`;
  plan += `### Phase 1: Core Structure\n`;
  plan += `1. ✅ Logo Section (CTA component)\n`;
  plan += `2. ⚠️ Navigation Bar (needs token updates)\n`;
  plan += `3. ❌ Page Header (PageTitle component)\n`;
  plan += `4. ❌ Hero Section (needs creation)\n\n`;

  plan += `### Phase 2: Content Sections\n`;
  plan += `5. ⚠️ Copy Block Section (needs token updates)\n`;
  plan += `6. ⚠️ Story CTA Section (needs token updates)\n`;
  plan += `7. ⚠️ Image Gallery Section (needs token updates)\n`;
  plan += `8. ⚠️ Feature Cards Section (needs token updates)\n\n`;

  plan += `### Phase 3: Social & Footer\n`;
  plan += `9. ❌ Social Feed Preview (needs creation)\n`;
  plan += `10. ⚠️ Footer Section (needs token updates)\n\n`;

  plan += `## 🎨 Design Token Mapping\n\n`;
  plan += `### Colors\n`;
  Object.entries(FIGMA_DESIGN_TOKENS.colors).forEach(([key, value]) => {
    plan += `- \`${key}\`: \`${value}\`\n`;
  });

  plan += `\n### Typography\n`;
  Object.entries(FIGMA_DESIGN_TOKENS.typography).forEach(([key, value]) => {
    plan += `- \`${key}\`: \`${value}\`\n`;
  });

  plan += `\n### Spacing\n`;
  Object.entries(FIGMA_DESIGN_TOKENS.spacing).forEach(([key, value]) => {
    plan += `- \`${key}\`: \`${value}\`\n`;
  });

  return plan;
}

// Generate component implementation code
function generateComponentCode(componentName: string, figmaData: any): string {
  switch (componentName) {
    case 'PageTitle':
      return generatePageTitleCode(figmaData);
    case 'HeroSection':
      return generateHeroSectionCode(figmaData);
    case 'SocialFeedPreview':
      return generateSocialFeedPreviewCode(figmaData);
    default:
      return `// Implementation for ${componentName} component\n`;
  }
}

function generatePageTitleCode(figmaData: any): string {
  return `import React from 'react';

interface PageTitleProps {
  text?: string;
  className?: string;
}

export default function PageTitle({ 
  text = "Hello Bendy Friends!", 
  className = "" 
}: PageTitleProps) {
  return (
    <section className={\`page-title-section \${className}\`}>
      <div className="page-title-container">
        <h1 className="page-title-text">
          {text}
        </h1>
      </div>
    </section>
  );
}`;
}

function generateHeroSectionCode(figmaData: any): string {
  return `import React from 'react';
import Image from 'next/image';

interface HeroSectionProps {
  imageSrc?: string;
  imageAlt?: string;
  className?: string;
}

export default function HeroSection({ 
  imageSrc = "/images/hero-image.jpg",
  imageAlt = "Hero background",
  className = "" 
}: HeroSectionProps) {
  return (
    <section className={\`hero-section \${className}\`}>
      <div className="hero-background">
        <Image 
          src={imageSrc}
          alt={imageAlt}
          fill
          className="hero-image"
          priority
        />
      </div>
      <div className="hero-content">
        <div className="hero-headline">
          <h2 className="hero-title">Finding my peace has been a journey</h2>
        </div>
        <div className="hero-bullets">
          <p className="hero-bullet">The pain</p>
          <p className="hero-bullet">The gaslighting</p>
          <p className="hero-bullet">The fear</p>
          <p className="hero-bullet">The loneliness</p>
        </div>
        <div className="hero-story">
          <h3 className="hero-story-title">It all led me to this</h3>
          <p className="hero-story-subtitle">Here is my story</p>
        </div>
      </div>
    </section>
  );
}`;
}

function generateSocialFeedPreviewCode(figmaData: any): string {
  return `import React from 'react';

interface SocialFeedPreviewProps {
  className?: string;
}

export default function SocialFeedPreview({ className = "" }: SocialFeedPreviewProps) {
  return (
    <section className={\`social-feed-preview \${className}\`}>
      <div className="social-cta">
        <div className="social-cta-content">
          <div className="instagram-icon">
            {/* Instagram icon */}
          </div>
          <h2 className="social-cta-text">Follow me on Instagram to see more</h2>
          <div className="instagram-icon">
            {/* Instagram icon */}
          </div>
        </div>
      </div>
      
      <div className="instagram-feed">
        {/* Instagram posts grid */}
      </div>
      
      <div className="quote-section">
        <div className="quote-content">
          <p className="quote-text">Alone we can do so little; together we can do so much</p>
          <p className="quote-author">– Helen Keller</p>
        </div>
      </div>
    </section>
  );
}`;
}

// Main execution
async function main() {
  console.log('🎨 Bendy Beth Homepage Analysis\n');
  console.log('=' .repeat(50) + '\n');

  // Analyze current implementation
  const analysis = analyzeHomepage();

  // Generate implementation plan
  const plan = generateImplementationPlan(analysis);

  // Save analysis results
  const outputDir = path.join(process.cwd(), 'data', 'homepage-analysis');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(outputDir, 'implementation-plan.md'),
    plan
  );

  fs.writeFileSync(
    path.join(outputDir, 'analysis-results.json'),
    JSON.stringify(analysis, null, 2)
  );

  // Generate component code for missing components
  const missingComponentsDir = path.join(outputDir, 'missing-components');
  if (!fs.existsSync(missingComponentsDir)) {
    fs.mkdirSync(missingComponentsDir, { recursive: true });
  }

  analysis.missingComponents.forEach(componentName => {
    const code = generateComponentCode(componentName, {});
    fs.writeFileSync(
      path.join(missingComponentsDir, `${componentName}.tsx`),
      code
    );
  });

  // Print summary
  console.log(plan);
  console.log('\n📁 Analysis files saved to:');
  console.log(`   - ${path.join(outputDir, 'implementation-plan.md')}`);
  console.log(`   - ${path.join(outputDir, 'analysis-results.json')}`);
  console.log(`   - ${path.join(missingComponentsDir, '*.tsx')}`);

  console.log('\n🎯 Next Steps:');
  console.log('1. Review the implementation plan above');
  console.log('2. Fix design token violations in existing components');
  console.log('3. Create missing components using the generated code');
  console.log('4. Update homepage to use all components');
  console.log('5. Test responsive behavior across breakpoints');
}

main().catch(console.error); 