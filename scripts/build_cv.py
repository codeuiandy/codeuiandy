"""Build "Andrew Okeke.pdf" (CV) to match the v2 AI-engineer portfolio.

Usage (from project root):  python3 scripts/build_cv.py
Previous CV is backed up at v1/Andrew Okeke - CV v1.pdf

Design goals: one page, ATS-friendly (real selectable text, standard headings,
single column), restrained colour, experience first.
"""
import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether, Flowable,
)

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "Andrew Okeke.pdf")
LOGO_SRC = os.path.join(ROOT, "images", "codeuiandy-logo.png")

INK = colors.HexColor("#111827")
TEXT = colors.HexColor("#273043")
MUTED = colors.HexColor("#6b7280")
ACCENT = colors.HexColor("#5b21b6")   # deep violet
ACCENT_2 = colors.HexColor("#0e7490")  # deep cyan
RULE = colors.HexColor("#d1d5db")

W, H = A4
M = 13 * mm
CW = W - 2 * M - 12  # content width (frame has 6pt padding each side)

# ---------- styles ----------
def S(name, **kw):
    base = dict(fontName="Helvetica", fontSize=9.3, leading=12.6, textColor=TEXT)
    base.update(kw)
    return ParagraphStyle(name, **base)

body = S("body")
small = S("small", fontSize=8.5, leading=11, textColor=MUTED)
bullet = S("bullet", leftIndent=10, bulletIndent=1, spaceAfter=1.2, bulletColor=ACCENT, bulletFontSize=9)
h2 = S("h2", fontName="Helvetica-Bold", fontSize=9.6, leading=12, textColor=ACCENT)
role = S("role", fontName="Helvetica-Bold", fontSize=10.2, leading=13, textColor=INK)
right = S("right", fontSize=8.7, leading=13, textColor=MUTED, alignment=2)
label = S("label", fontName="Helvetica-Bold", fontSize=9, leading=12.6, textColor=INK)
name_s = S("name", fontName="Helvetica-Bold", fontSize=23, leading=26, textColor=INK)
title_s = S("title", fontName="Helvetica-Bold", fontSize=11.2, leading=15, textColor=ACCENT)
contact_s = S("contact", fontSize=8.7, leading=12, textColor=MUTED)


def a(url, text):
    return f'<a href="{url}" color="#0e7490">{text}</a>'


class Rule(Flowable):
    def __init__(self, width, thick=0.6, color=RULE, space=2):
        super().__init__()
        self.width, self.thick, self.color, self.space = width, thick, color, space

    def wrap(self, *_):
        return self.width, self.thick + self.space

    def draw(self):
        self.canv.setStrokeColor(self.color)
        self.canv.setLineWidth(self.thick)
        self.canv.line(0, self.space, self.width, self.space)


class GradientRule(Flowable):
    def __init__(self, width, height=1.4):
        super().__init__()
        self.width, self.height = width, height

    def wrap(self, *_):
        return self.width, self.height

    def draw(self):
        c, n = self.canv, 80
        a_, b_ = (0.055, 0.455, 0.565), (0.357, 0.129, 0.714)
        for i in range(n):
            t = i / n
            c.setFillColor(colors.Color(*[a_[k] + (b_[k] - a_[k]) * t for k in range(3)]))
            c.rect(self.width * i / n, 0, self.width / n + 0.4, self.height, stroke=0, fill=1)


def section(title):
    return [Spacer(1, 7), Paragraph(title.upper(), h2), Rule(CW, space=3), Spacer(1, 3)]


def tight(t, extra=()):
    t.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0), ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
        *extra,
    ]))
    return t


def circle_logo(size_px=300):
    try:
        from PIL import Image as PILImage, ImageDraw
        im = PILImage.open(LOGO_SRC).convert("RGBA").resize((size_px, size_px))
        mask = PILImage.new("L", (size_px, size_px), 0)
        ImageDraw.Draw(mask).ellipse((0, 0, size_px, size_px), fill=255)
        im.putalpha(mask)
        out = os.path.join(ROOT, "scripts", ".logo-circle.png")
        im.save(out)
        return out
    except Exception:
        return None


def job(title, org, meta, when, points, stack):
    head = tight(Table([[Paragraph(title, role), Paragraph(when, right)]], colWidths=[CW - 42 * mm, 42 * mm]))
    org_line = Paragraph(f'<font color="#0e7490"><b>{org}</b></font> &nbsp;<font color="#6b7280">· {meta}</font>', body)
    items = [head, org_line, Spacer(1, 2.5)]
    items += [Paragraph(p, bullet, bulletText="•") for p in points]
    items += [Paragraph(f'<font color="#6b7280"><b>Stack:</b> {stack}</font>', small), Spacer(1, 6)]
    return KeepTogether(items)


# ---------- content ----------
story = []

logo = circle_logo()
header_text = [
    Paragraph("Andrew Okeke", name_s),
    Paragraph("Senior Software Engineer &amp; Contractor &nbsp;<font color='#0e7490' size='9.5'>· AI-accelerated delivery</font>", title_s),
    Paragraph(
        "Lagos, Nigeria (remote worldwide) &nbsp;|&nbsp; +234 811 565 9965 &nbsp;|&nbsp; "
        + a("mailto:frostandy41@gmail.com", "frostandy41@gmail.com") + "<br/>"
        + a("https://codeuiandy.vercel.app", "codeuiandy.vercel.app") + " &nbsp;|&nbsp; "
        + a("https://www.linkedin.com/in/codeuiandy/", "linkedin.com/in/codeuiandy") + " &nbsp;|&nbsp; "
        + a("https://github.com/codeuiandy", "github.com/codeuiandy"),
        contact_s),
]
if logo:
    from reportlab.platypus import Image
    story.append(tight(Table([[header_text, Image(logo, 19 * mm, 19 * mm)]],
                             colWidths=[CW - 20 * mm, 20 * mm]),
                       [("VALIGN", (1, 0), (1, 0), "MIDDLE"), ("ALIGN", (1, 0), (1, 0), "RIGHT")]))
else:
    story += header_text
story += [Spacer(1, 7), GradientRule(CW)]

story += section("Profile")
story.append(Paragraph(
    "Senior software engineer and contractor with 5+ years writing production code for web and mobile "
    "products used in Africa and the US. I design the architecture, write and review the code, and own "
    "delivery, then use AI-assisted development to <b>ship weeks of work in days</b> without cutting corners. "
    "I also build AI features (LLM assistants, RAG, agents) when a product needs them. Currently Team Lead at "
    "Discovery Vault Technology; remote contractor for US teams since 2022. Available for projects, retainers "
    "and team augmentation.", body))

story += section("Core skills")
skills = [
    ("Engineering", "TypeScript, JavaScript, React.js, Next.js, Node.js, REST &amp; GraphQL, HTML, CSS/SCSS, "
                    "PWAs, testing, CI/CD"),
    ("Mobile", "React Native (iOS &amp; Android), app store releases"),
    ("AI speed", "AI pair-programming and agentic coding tools, AI-generated tests and docs, rapid prototyping"),
    ("AI features", "LLM APIs, retrieval-augmented generation (RAG), AI agents &amp; tool calling, vector search, "
                    "streaming chat interfaces, Python"),
    ("Leadership", "Team leadership, frontend architecture, code review, mentoring, Agile delivery, client consulting"),
]
story.append(tight(Table([[Paragraph(k, label), Paragraph(v, body)] for k, v in skills],
                         colWidths=[24 * mm, CW - 24 * mm]),
                   [("BOTTOMPADDING", (0, 0), (-1, -1), 2)]))

story += section("Professional experience")
story += [
    job("Senior Software Engineer, Team Lead", "Discovery Vault Technology",
        "Full-time, hybrid, Lagos", "Sep 2023 – Present", [
            "Lead the engineering team delivering secure, scalable software, cloud platforms and APIs for organisations across West Africa and worldwide.",
            "Own frontend architecture, coding standards and code review, raising performance and release quality.",
            "Partner with product, design and backend teams to scope features, plan sprints and ship production-ready interfaces.",
        ], "React.js, TypeScript, React Native"),
    job("Senior Software Engineer (Contract)", "BreezeLearn",
        "Remote, United States", "Jul 2022 – Aug 2023", [
            "Built web and mobile applications across the BreezeGPT product family, including AI-powered products.",
            "Sole frontend engineer on BONNEE, a US clothing-swap app, owning delivery from first build through store releases.",
            "Worked asynchronously with a US product team: clear written scoping, regular demos and dependable delivery.",
        ], "React.js, React Native, TypeScript"),
    job("Frontend Developer", "Sterling Bank",
        "Full-time, remote, Lagos", "Jun 2021 – Jun 2022", [
            "Developed React and React Native interfaces for digital banking products used by customers across Nigeria.",
            "Worked with designers and stakeholders to improve consistency and engagement across digital channels.",
        ], "React.js, React Native"),
    job("Frontend Developer", "ITSkillsCenter",
        "Full-time, on-site, Lagos", "Jan 2020 – May 2021", [
            "Built responsive interfaces for client products and helped train junior developers in modern frontend practice.",
        ], "JavaScript, HTML, CSS"),
]

story += section("Selected projects")
projects = [
    ("Answir", "https://answir.ai/", "answir.ai",
     "AI investor-relations platform that answers investor questions instantly from public filings."),
    ("Breezeflow", "https://www.breezeflow.io/", "breezeflow.io",
     "24/7 AI customer-support platform; built onboarding and sign-in flows."),
    ("CozyIntro", "https://cozyintro.breezegpt.io/", "cozyintro.breezegpt.io",
     "Creator fan-engagement experience from the BreezeGPT family."),
    ("BONNEE", "https://www.bonnee.co/", "bonnee.co",
     "Clothing-swap mobile app for the US market; sole frontend engineer (React Native)."),
]
rows = [[Paragraph(f"<b>{n}</b>", label),
         Paragraph(f'{d} <font size="8">{a(u, t)}</font>', body)] for n, u, t, d in projects]
story.append(tight(Table(rows, colWidths=[24 * mm, CW - 24 * mm]), [("BOTTOMPADDING", (0, 0), (-1, -1), 2.5)]))
story.append(Spacer(1, 2))
story.append(Paragraph(
    "<b>Also delivered:</b> RetinaLogik (VR vision testing), Omnibiz Retail (B2B retail app), Tremendoc "
    "(telemedicine), Collar Gig (freelance marketplace), Erider (logistics app). Client work with Soar Digital, "
    "AlphaCX and Paysync.", body))


def footer(c, doc):
    c.saveState()
    c.setFont("Helvetica", 7.5)
    c.setFillColor(MUTED)
    c.drawString(M + 6, 9 * mm, "Andrew Okeke · Senior Software Engineer & Contractor")
    c.drawRightString(W - M - 6, 9 * mm, f"Page {doc.page}")
    c.restoreState()


doc = SimpleDocTemplate(OUT, pagesize=A4, leftMargin=M, rightMargin=M, topMargin=13 * mm, bottomMargin=15 * mm,
                        title="Andrew Okeke - Senior Software Engineer & Contractor - CV", author="Andrew Okeke",
                        subject="Curriculum Vitae")
doc.build(story, onFirstPage=footer, onLaterPages=footer)
if logo and os.path.exists(logo):
    os.remove(logo)
print("wrote", OUT)
