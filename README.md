# YAFB

Open-source yet another form-builder based on Angular and [NG-Zorro](https://ng.ant.design/components/overview/en).

# Project roles

## Role definitions

### Engineer

The **Engineer** is responsible for designing, developing, testing, and maintaining software systems.
Engineers work closely with other team members, including UI/UX experts, Shepherds, and Taskmasters, to ensure high-quality deliverables that meet business and user requirements.

### Shepherd

The **Shepherd** serves as a guide and reviewer for the engineering team, ensuring all work adheres to quality standards, architectural guidelines, and coding conventions.
This role focuses on mentoring, reviewing work, and helping engineers grow while ensuring the consistency and maintainability of the codebase.

### Taskmaster

The **Taskmaster** is responsible for transforming meeting outcomes, project discussions, and stakeholder feedback into actionable, well-defined tasks for the engineering team.
The Taskmaster ensures tasks are clear, prioritized, and assigned appropriately.

### UI/UX expert

The **UI/UX Expert** is responsible for designing user interfaces and user experiences that align with modern design principles and user expectations.
This role ensures products are functional, aesthetically pleasing, and intuitive.

## Role responsibilities

### Engineer
- Develop high-quality, maintainable, and efficient code.
- Collaborate with designers and other engineers.
- Participate in code reviews and contribute to best practices.
- Debug and resolve technical issues.
- Write unit tests.

### Shepherd
- Conduct thorough code reviews for engineers' work.
- Provide constructive feedback to improve code quality and adherence to standards.
- Assist in technical decision-making and resolving conflicts.

### Taskmaster
- Attend team meetings, planning sessions, and stakeholder discussions.
- Capture, document, and break down high-level ideas into specific tasks.
- Define task descriptions and acceptance criteria.
- Maintain and groom the product backlog.
- Work closely with engineers and designers to clarify requirements.
- Track the status of tasks and identify potential blockers.

### UI/UX expert
- Strictly follow the [NG-Zorro design system](https://ng.ant.design/components/overview/en).
- Ensure that the UI/UX of the form-builder looks mistakenly as an example or part of the NG-Zorro component library.
- Ensure that only NG-Zorro standard components, icons, and styles are used, and the Stakeholder must approve any deviation from the standard.
- Stay updated with modern design trends and tools.
- Advocate for user-centric design across the project.
- Collaborate with engineers to ensure designs are feasible and implemented correctly.
- Implement simple design improvements.

### Stakeholder

...

# Development guide

## Principles for development

### Code quality first

To maintain the highest quality standard, all code must be reviewed before merging into the main branch. High-quality code is:

- **Readable**: Clear, well-structured, and easy to understand for any developer.
- **Maintainable**: Designed for easy modification, extension, and debugging.
- **Scalable**: Efficiently handles increasing complexity and load.
- **Performant**: Avoids unnecessary computations, ensuring responsiveness.
- **Secure**: Free from known vulnerabilities, following best security practices.
- **Tested**: Includes unit tests, integration tests, and, where applicable, E2E tests.

### Code quality practices

- **Code reviews**: Every code change must undergo peer review to ensure best practices.
- **Frequent refactoring**: Code should be continuously improved to remove technical debt.
- **Automated code checks**: Linting, static analysis, and CI/CD pipelines must enforce consistency.
- **Documentation**: Critical parts of the system must be documented, either through inline comments or external documentation.
- **Consistency**: Follow agreed-upon coding standards and architectural principles.

### UI/UX quality first

We prioritize user experience by adhering to the NG-Zorro design system, ensuring a cohesive, intuitive, high-quality interface.

### UI/UX principles

- **Design system compliance**: Follow NG-Zorro guidelines to maintain design consistency.
- **Interaction**: Ensure seamless, intuitive, and predictable user interactions.
- **Spacing**: Maintain adequate margins, paddings, and whitespace to enhance readability and usability.
- **Consistency**: Use standardized UI components, typography, and layout structures.
- **Structure**: Organize information hierarchically for clarity and easy navigation.
- **Simplicity**: Keep interfaces clean, avoid unnecessary elements, and focus on essential functionality.
- **Visibility**: Ensure important actions and information are easily discoverable.
- **Typography**: Use clear, legible fonts with appropriate sizing and hierarchy.
- **Copywriting**: Write concise, user-friendly, and action-driven text in the UI.
- **Color**: Adhere to the NG-Zorro color scheme for accessibility and visual harmony.
- **Reusability**: Build modular components that can be reused across multiple screens.
- **Devices and media**: Ensure responsiveness and adaptability across different screen sizes and devices.

#### Examples of good quality in UI/UX

To illustrate what a well-designed UI/UX looks like when adhering to best practices, we provide the following examples:
- [Enlink](https://themeforest.net/item/enlink-angular-admin-template/23804615#)
- [Egret](https://themeforest.net/item/egret-angular-4-material-design-admin-template/20161805)
- [Cuba](https://themeforest.net/item/cuba-bootstrap-responsive-admin-dashboard-template/27530933)

These examples are not meant to be copied, nor should their design systems be replicated verbatim. Instead, they serve as a **benchmark** for how a well-structured UI/UX implementation looks when it follows key principles such as **consistency, clarity, responsiveness, and efficiency**.

#### UI/UX principles and code optimization

A program that adheres to strong UI/UX principles naturally leads to a well-optimized codebase. This is because:

- High standardization → The use of reusable components, design tokens, and predefined patterns reduces redundancy and complexity.
- Minimalistic stylesheets → A well-designed UI avoids unnecessary custom CSS and inline styles, keeping stylesheets small and efficient.
- Optimized JS → Consistent and modular UI elements prevent excessive DOM manipulations and unnecessary script bloat.
- Better compression & caching → Standardized UI frameworks result in well-structured, easily compressible files, leading to better performance.

#### UI/UX and code quality: A synergistic relationship

Good UI/UX design and code quality go hand in hand:

- A clean, structured UI reflects an equally well-structured codebase with modular and reusable components.
- Adhering to design principles reduces technical debt, as the interface remains scalable and easy to maintain.
- A well-designed system improves performance, ensuring smooth rendering, fast loading times, and optimal responsiveness.

By following these principles, we ensure that user experience and development efficiency remain at the highest level.
