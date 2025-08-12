import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import OnboardingTour, { TourStep } from "@/components/tour/OnboardingTour";

const RouteTours: React.FC = () => {
  const { pathname } = useLocation();

  const { steps, storageKey } = useMemo(() => {
    let s: TourStep[] = [];
    let key = `onboarding:v1:${pathname.split('/')[1] || 'home'}`;

    if (pathname.startsWith('/projects/') && pathname.split('/').length === 3) {
      // Project Details
      s = [
        { selector: '[data-tour="project-title"]', title: 'Project Overview', content: 'See the project status, priority, and key details at a glance.' },
        { selector: '[data-tour="project-tabs"]', title: 'Deep Dive Tabs', content: 'Navigate through timeline, budget, risks, docs, and more.', padding: 8 },
        { selector: '[data-tour="project-edit"]', title: 'Edit Project', content: 'Update project details and preferences anytime.', padding: 8 },
      ];
      key = 'onboarding:v1:project-details';
    } else if (pathname.startsWith('/projects/new')) {
      s = [
        { selector: '[data-tour="projectnew-title"]', title: 'Create a New Project', content: 'Provide project basics and configuration.' },
        { selector: '[data-tour="projectnew-form"]', title: 'Project Form', content: 'Fill in required fields, assign owners, and set dates.', padding: 12 },
      ];
      key = 'onboarding:v1:project-new';
    } else if (pathname.startsWith('/projects')) {
      s = [
        { selector: '[data-tour="projects-title"]', title: 'Projects', content: 'Manage and monitor your projects from here.' },
        { selector: '[data-tour="projects-new"]', title: 'Create Project', content: 'Start a new project using templates and best practices.', padding: 8 },
        { selector: '[data-tour="projects-filters"]', title: 'Search & Filter', content: 'Quickly find projects by name and status.' },
        { selector: '[data-tour="projects-grid"]', title: 'Project Cards', content: 'Open a project to view details and progress.' },
      ];
      key = 'onboarding:v1:projects';
    } else if (pathname.startsWith('/products')) {
      s = [
        { selector: '[data-tour="products-title"]', title: 'Products', content: 'Organize projects by product for clear portfolio views.' },
        { selector: '[data-tour="products-new"]', title: 'New Product', content: 'Create a product to group related projects.', padding: 8 },
        { selector: '[data-tour="products-search"]', title: 'Search Products', content: 'Locate products quickly by name or tags.' },
        { selector: '[data-tour="products-grid"]', title: 'Product Cards', content: 'Click a product to see associated projects.' },
      ];
      key = 'onboarding:v1:products';
    } else if (pathname.startsWith('/templates')) {
      s = [
        { selector: '[data-tour="templates-title"]', title: 'Project Templates', content: 'Standardize project setup with reusable templates.' },
        { selector: '[data-tour="templates-new"]', title: 'Create Template', content: 'Define fields and defaults for consistent projects.', padding: 8 },
        { selector: '[data-tour="templates-grid"]', title: 'Templates List', content: 'Manage and edit your templates here.' },
      ];
      key = 'onboarding:v1:templates';
    } else if (pathname.startsWith('/dashboard')) {
      s = [
        { selector: '[data-tour="nav-dashboard"]', title: 'Dashboard', content: 'Your overview of activity, health, and KPIs.' },
        { selector: '[data-tour="nav-projects"]', title: 'Projects', content: 'Jump to your projects list.' },
        { selector: '[data-tour="nav-templates"]', title: 'Templates', content: 'Create reusable project blueprints.' },
      ];
      key = 'onboarding:v1:dashboard';
    } else {
      // Fallback: highlight main navigation
      s = [
        { selector: '[data-tour^="nav-"]', title: 'Navigation', content: 'Use the top navigation to move around the app.' },
      ];
      key = 'onboarding:v1:general';
    }

    return { steps: s, storageKey: key };
  }, [pathname]);

  if (!steps || steps.length === 0) return null;

  return <OnboardingTour steps={steps} autoStart storageKey={storageKey} />;
};

export default RouteTours;
