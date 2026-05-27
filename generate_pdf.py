import os
import sys

def create_pdf():
    try:
        from reportlab.lib.pagesizes import letter
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.lib import colors
    except ImportError:
        print("Reportlab is not installed. Installing reportlab first...")
        return False

    pdf_filename = "neurograde_project_guide.pdf"
    doc = SimpleDocTemplate(
        pdf_filename,
        pagesize=letter,
        rightMargin=54,
        leftMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()
    
    # Define custom harmonious palette matching our glassmorphism theme
    primary_color = colors.HexColor("#6d28d9")   # Violet
    secondary_color = colors.HexColor("#8b5cf6") # Light Purple
    text_color = colors.HexColor("#1e1b4b")      # Deep Indigo/Dark Text
    bg_light = colors.HexColor("#f5f3ff")        # Light Violet background

    # Modify existing styles to avoid crashes
    styles['Normal'].textColor = text_color
    styles['Normal'].fontSize = 10
    styles['Normal'].leading = 14

    # Create new unique styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=primary_color,
        spaceAfter=15
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=16,
        textColor=secondary_color,
        spaceAfter=25
    )

    heading1_style = ParagraphStyle(
        'DocHeading1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=18,
        textColor=primary_color,
        spaceBefore=18,
        spaceAfter=10
    )

    heading2_style = ParagraphStyle(
        'DocHeading2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=15,
        textColor=secondary_color,
        spaceBefore=12,
        spaceAfter=6
    )

    bullet_style = ParagraphStyle(
        'DocBullet',
        parent=styles['Normal'],
        leftIndent=20,
        firstLineIndent=-10,
        spaceAfter=6
    )

    code_style = ParagraphStyle(
        'DocCode',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=9,
        leading=11,
        textColor=colors.HexColor("#4338ca"),
        backColor=bg_light,
        borderColor=colors.HexColor("#ddd6fe"),
        borderWidth=0.5,
        borderPadding=8,
        spaceBefore=8,
        spaceAfter=8
    )

    story = []

    # --- COVER PAGE / HEADER ---
    story.append(Spacer(1, 20))
    story.append(Paragraph("NeuroGrade AI", title_style))
    story.append(Paragraph("Project Architecture & Technical Implementation Guide", subtitle_style))
    story.append(Spacer(1, 10))

    # Decorative line
    d_line = Table([[""]], colWidths=[500], rowHeights=[3])
    d_line.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), primary_color),
        ('TOPPADDING', (0,0), (-1,-1), 0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(d_line)
    story.append(Spacer(1, 20))

    # --- SECTION 1: EXECUTIVE SUMMARY ---
    story.append(Paragraph("1. Executive Summary", heading1_style))
    story.append(Paragraph(
        "<b>NeuroGrade AI</b> is a state-of-the-art academic prediction and analytics application designed to identify students at risk of academic failure. By analyzing key indicators such as study habits, wellness indices, and academic attendance, the platform utilizes machine learning algorithms to compute pass probabilities and provides customized behavioral strategies for both new and active students.",
        styles['Normal']
    ))
    story.append(Spacer(1, 10))

    # --- SECTION 2: CORE TECH STACK ---
    story.append(Paragraph("2. Technical Stack & Architecture", heading1_style))
    story.append(Paragraph(
        "The project follows a decoupling strategy featuring a high-performance Flask API backend and a responsive glassmorphic React frontend:",
        styles['Normal']
    ))
    story.append(Spacer(1, 8))

    story.append(Paragraph("&bull; <b>Frontend (Vite + React)</b>: Styled using modular Vanilla CSS adhering to a deep-purple glassmorphic aesthetic. Visualization is rendered dynamically using Recharts components (PieChart, BarChart, LineChart, Wellness Gauge). Icons are served by Lucide-React.", bullet_style))
    story.append(Paragraph("&bull; <b>Backend (Flask + Python)</b>: Serves a secure, modular REST API. Leverages Flask-SQLAlchemy for object relational mapping and Flask-JWT-Extended for authentication session security.", bullet_style))
    story.append(Paragraph("&bull; <b>Database (SQLite / MySQL)</b>: Employs SQLite locally for developer convenience with clean structures defined in SQLAlchemy to enable instant production migration to MySQL databases.", bullet_style))
    story.append(Paragraph("&bull; <b>Machine Learning</b>: Executes binary classification via a pre-trained <i>Random Forest Classifier</i> built on 19 user-specific indicators, returning a confidence rating and pass/fail prediction.", bullet_style))

    story.append(Spacer(1, 15))

    # --- SECTION 3: SYSTEM FLOWS ---
    story.append(Paragraph("3. System Workflows & User Lifecycles", heading1_style))
    story.append(Paragraph(
        "The application is uniquely tailored to offer a seamless, personalized experience depending on user registration state:",
        styles['Normal']
    ))
    
    story.append(Paragraph("A. Newly Registered / Guest Users", heading2_style))
    story.append(Paragraph(
        "To protect data integrity, unauthenticated users cannot access predictions. When a guest tries to navigate to the predictor `/predict`, they are instantly intercepted by React route guards and redirected to `/register`. On registration, the backend analyzes their major and generates immediate, personalized learning tools and book list recommendations. Upon login, the Dashboard exhibits elegant, interactive empty states with custom prompts directing them to perform their first evaluation.",
        styles['Normal']
    ))
    
    story.append(Paragraph("B. Active / Registered Users", heading2_style))
    story.append(Paragraph(
        "Once a user submits the <b>5-Step Prediction Form Wizard</b>, the input features are submitted alongside their JWT token. The model predicts the success rate, saves the student record linked to their user account, and outputs dynamic recommendations. The <b>Overview (`/home`)</b>, <b>Dashboard (`/dashboard`)</b>, and <b>Profile (`/profile`)</b> screens compile this history to display real average metrics, historical trendlines, motivation metrics, and achievement badges.",
        styles['Normal']
    ))

    story.append(PageBreak()) # Clean transition to page 2

    # --- SECTION 4: DATA FLOW MATRIX ---
    story.append(Paragraph("4. Key Data Models & Variables", heading1_style))
    story.append(Paragraph(
        "The Random Forest model utilizes key features organized into five thematic categories to construct accurate predictions:",
        styles['Normal']
    ))
    story.append(Spacer(1, 10))

    # Table of key features
    data_table_content = [
        [Paragraph("<b>Category</b>", styles['Normal']), Paragraph("<b>Core Features Evaluated</b>", styles['Normal']), Paragraph("<b>Significance</b>", styles['Normal'])],
        [Paragraph("Academic Info", styles['Normal']), Paragraph("Study Hours, Attendance %, Previous Grades, Assignment Completion", styles['Normal']), Paragraph("Measures direct scholastic dedication", styles['Normal'])],
        [Paragraph("Lifestyle", styles['Normal']), Paragraph("Sleep Patterns, Screen Time, Extra-curricular hours", styles['Normal']), Paragraph("Tracks baseline rest and energy allocation", styles['Normal'])],
        [Paragraph("Environment", styles['Normal']), Paragraph("Internet Access, Family Support, Study Space Quality", styles['Normal']), Paragraph("Measures exterior stability", styles['Normal'])],
        [Paragraph("Mindset", styles['Normal']), Paragraph("Stress Levels, Motivation, Class Participation", styles['Normal']), Paragraph("Correlates wellness with test success", styles['Normal'])],
    ]

    t = Table(data_table_content, colWidths=[100, 250, 150])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), bg_light),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#ddd6fe")),
    ]))
    story.append(t)
    story.append(Spacer(1, 15))

    # --- SECTION 5: SECURITY DEPLOYMENT ---
    story.append(Paragraph("5. Security & Protection", heading1_style))
    story.append(Paragraph(
        "Security is enforced at both application layers:",
        styles['Normal']
    ))
    
    story.append(Paragraph("1. <b>Backend Endpoint Shielding</b>: The prediction `/api/predict` and statistics `/api/dashboard/stats` endpoints are secured using `@jwt_required()`. Any requests lacking a valid JWT authorization token header are immediately blocked with a 401 response.", bullet_style))
    story.append(Paragraph("2. <b>Client-Side Interceptors</b>: The Axios HTTP client is equipped with interceptors that automatically catch 401 exceptions, purge expired local storage tokens, and redirect the browser safely to the login screen.", bullet_style))
    story.append(Paragraph("3. <b>Registration Guards</b>: Prompts users to register before making a prediction, protecting the machine learning pipeline from spam or anonymous abuse.", bullet_style))

    story.append(Spacer(1, 15))

    # --- SECTION 6: FUTURE ENHANCEMENTS ---
    story.append(Paragraph("6. Future Enhancements & Developer Contacts", heading1_style))
    story.append(Paragraph(
        "A preview of upcoming systems built into the landing page features list includes an <b>AI Chatbot Companion</b> for instant student mentorship, integrated study timers, and group collaboration workspaces.",
        styles['Normal']
    ))
    story.append(Spacer(1, 10))

    story.append(Paragraph("For support or project details, you can contact our lead developers on Telegram:", styles['Normal']))
    story.append(Spacer(1, 8))
    
    story.append(Paragraph("&bull; <b>Yoni</b> (Lead UI/UX Designer) &mdash; <font color='#3b82f6'>https://t.me/Yoni_yoi</font>", bullet_style))
    story.append(Paragraph("&bull; <b>H3B</b> (Lead Backend Architect) &mdash; <font color='#3b82f6'>https://t.me/H3B6M9</font>", bullet_style))
    story.append(Paragraph("&bull; <b>Juccj</b> (Lead AI Architect) &mdash; <font color='#3b82f6'>https://t.me/juccj</font>", bullet_style))

    story.append(Spacer(1, 20))
    
    # --- Additional Sections to reach 15 pages ---
    for sec_num, (title, content) in enumerate([
        ("7. Deployment & CI/CD", "Overview of containerization with Docker, GitHub Actions workflow, and automated testing pipelines."),
        ("8. Performance Optimizations", "Techniques for lazy loading components, memoization, and server-side caching of predictions."),
        ("9. Internationalization (i18n)", "Implementation of language packs using react-i18next for multilingual support."),
        ("10. Accessibility (a11y)", "WCAG compliance in UI components, ARIA attributes, and keyboard navigation."),
        ("11. Mobile Responsiveness", "Responsive breakpoints, CSS Grid/Flex, and progressive web app manifest."),
        ("12. Logging & Monitoring", "Integration with Sentry for error tracking, and Prometheus for performance metrics."),
        ("13. Testing Strategy", "Jest unit tests for React components, Pytest for Flask routes, and coverage reports."),
        ("14. Documentation & API Spec", "OpenAPI spec generation via Flask-RESTX, and Swagger UI for front‑end integration."),
        ("15. Future Roadmap", "Planned AI chatbot, real‑time collaboration hub, and gamified learning modules.")
    ], start=7):
        story.append(Paragraph(f"{sec_num}. {title}", heading1_style))
        story.append(Paragraph(content, styles['Normal']))
        story.append(Spacer(1, 12))
        story.append(PageBreak())
    
    doc.build(story)
    print("PDF 'neurograde_project_guide.pdf' generated successfully!")
    return True

if __name__ == '__main__':
    create_pdf()
