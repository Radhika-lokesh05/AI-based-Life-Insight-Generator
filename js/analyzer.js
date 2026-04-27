/**
 * analyzer.js — AI Life Pattern Analysis Engine
 * Generates structured, probabilistic life insights based on name and DOB.
 * All analysis is grounded in general behavioral psychology and life-stage research.
 */

const LifeAnalyzer = (() => {

  /* ── Helpers ───────────────────────────────────────────────── */

  function calcAge(dob) {
    const birth = new Date(dob);
    const now   = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
    return age;
  }

  function getInitials(name) {
    return name.trim().split(/\s+/).map(w => w[0].toUpperCase()).join('').slice(0, 2);
  }

  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function getLifeStage(age) {
    if (age < 13)  return { label: 'Childhood',          emoji: '🧒' };
    if (age < 18)  return { label: 'Adolescence',        emoji: '🎒' };
    if (age < 23)  return { label: 'Early Adulthood',    emoji: '📚' };
    if (age < 28)  return { label: 'Career Entry Phase', emoji: '🚀' };
    if (age < 35)  return { label: 'Growth Phase',       emoji: '📈' };
    if (age < 45)  return { label: 'Consolidation Phase',emoji: '⚖️' };
    if (age < 55)  return { label: 'Peak Performance',   emoji: '🏆' };
    if (age < 65)  return { label: 'Wisdom Phase',       emoji: '🌿' };
    return           { label: 'Reflective Phase',        emoji: '🌅' };
  }

  /* ── Core Nature ──────────────────────────────────────────── */

  function getCoreNature(age) {
    const pools = {
      universal: [
        'Tends to be adaptable in unfamiliar situations, though this may take time to develop fully.',
        'Likely develops stronger self-awareness as experiences accumulate over time.',
        'May exhibit a balance of introverted and extroverted tendencies depending on context.',
        'Possibly drawn to routine and structure, while still remaining open to change when necessary.',
        'Tends to reflect on past decisions before committing to new paths.',
        'May find personal relationships a significant source of motivation and stability.',
      ],
      teen: [
        'Likely in the process of forming a stable personal identity — a normal, healthy phase.',
        'Tends to be influenced heavily by peer dynamics and social belonging needs.',
        'May experience heightened emotional sensitivity, which often balances out with age.',
        'Possibly exploring interests and passions across multiple domains simultaneously.',
        'Tends to show bursts of high energy followed by periods of low motivation — common at this stage.',
      ],
      earlyAdult: [
        'Likely navigating the tension between independence and remaining connected to family support.',
        'Tends to place high value on peer approval, though this may gradually shift toward self-validation.',
        'Possibly driven by a strong desire to prove capability and establish personal credibility.',
        'May find abstract thinking and idealism prominent — useful for creative problem-solving.',
        'Tends to be energetic and action-oriented, though decision-making may still be maturing.',
      ],
      midAdult: [
        'Tends to approach decisions with greater practicality as experience provides clearer context.',
        'May show a growing preference for depth over breadth in both relationships and interests.',
        'Likely developing stronger emotional regulation compared to earlier years.',
        'Tends to prioritize long-term stability over short-term excitement in most life areas.',
        'May increasingly seek meaningful work and relationships over purely transactional ones.',
      ],
      seniorAdult: [
        'Tends to demonstrate well-developed patience and perspective in navigating challenges.',
        'Likely prioritizes quality relationships over social breadth.',
        'May show a preference for consistency, familiarity, and proven strategies.',
        'Tends to have a well-defined sense of personal values that guide major decisions.',
        'Possibly more selective with time and energy — a healthy and adaptive tendency.',
      ],
    };

    let pool;
    if (age < 18)      pool = [...pools.universal, ...pools.teen];
    else if (age < 28) pool = [...pools.universal, ...pools.earlyAdult];
    else if (age < 50) pool = [...pools.universal, ...pools.midAdult];
    else               pool = [...pools.universal, ...pools.seniorAdult];

    // Shuffle and pick 5–6 unique traits
    const shuffled = pool.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 6);
  }

  /* ── Family Life ──────────────────────────────────────────── */

  function getFamilyLife(age) {
    const past = age < 18
      ? 'Likely still in the formative phase of early family life, shaped significantly by parental guidance and household environment. The quality of early bonds tends to influence communication patterns and trust tendencies in later years.'
      : age < 30
      ? 'Early life was most likely spent in a structured family environment that provided foundational values and behavioral patterns. The degree of warmth, structure, and communication in that environment may still influence current relationship expectations.'
      : 'Early family experiences have likely already shaped core personality patterns. Whether those years were smooth or challenging, they tend to contribute to current approaches to responsibility, empathy, and conflict resolution.';

    const present = age < 18
      ? 'Currently likely dependent on parental or guardian support for most daily needs. This is developmentally appropriate and typically involves gradual negotiation of autonomy.'
      : age < 25
      ? 'Possibly in a transitional phase — beginning to assert independence while still maintaining close ties with family. Financial or emotional reliance on family may still be present, which is common at this stage.'
      : age < 35
      ? 'Likely operating with significant independence in daily life. Possible development of new family responsibilities, such as a partner or co-habitation, is becoming more probable at this stage.'
      : 'Most likely managing a largely independent household. Family responsibilities — whether toward aging parents, a partner, or children — may be increasing, which is typical for this life phase.';

    const future = age < 20
      ? 'Over the next several years, a growing need for independence is likely. Educational or professional transitions may naturally shift the balance away from family dependence.'
      : age < 35
      ? 'Possible formation of a new family unit in the coming years. Increased responsibility toward aging parents and/or a partner or children is likely over time.'
      : 'Long-term family responsibilities may deepen — including eldercare, continued partnership investment, and possibly grandparent-level roles in the distant future.';

    return { past, present, future };
  }

  /* ── Love & Relationships ─────────────────────────────────── */

  function getLoveLife(age) {
    const types = [
      'Tends toward emotionally cautious bonding — may take time to fully open up, but tends to build deep, lasting connections once trust is established.',
      'Likely approaches relationships with a practical mindset, seeking compatibility and stability alongside emotional connection.',
      'May show a pattern of forming intense connections quickly, which can deepen meaningfully or require boundary-setting over time.',
      'Tends to value intellectual compatibility alongside emotional closeness — conversations and shared values may be important indicators of interest.',
      'Possibly balances independence strongly with relationship needs — may require a partner who respects personal space.',
    ];

    const near = age < 20
      ? 'Exploration of early romantic dynamics is likely. Relationships at this stage tend to be formative but may lack long-term stability — which is developmentally normal.'
      : age < 28
      ? 'Possible deepening of existing romantic connections or discovery of a more compatible match. Career and social expansion may naturally create new relationship opportunities.'
      : age < 40
      ? 'Near-term focus may shift toward evaluating long-term compatibility rather than casual exploration. Partnership stability may become an increasing priority.'
      : 'Possible focus on deepening existing committed relationships rather than starting new ones. Emotional maturity likely brings more intentional partnership dynamics.';

    const mid = age < 22
      ? 'Over 3–5 years, relationship patterns will likely become clearer. Increased emotional maturity may lead to more intentional partner selection.'
      : age < 35
      ? 'Likelihood of a committed relationship or formal partnership increases during this period. Co-habitation, engagement, or marriage are possibilities, depending on individual priorities and circumstances.'
      : 'Existing relationships may undergo a phase of deepened commitment or re-evaluation. Communication and shared goals tend to become more central to relationship health at this stage.';

    const longTerm = age < 30
      ? 'Long-term, a stable partnership or marriage becomes statistically more probable. Building a shared life, possibly including family, becomes a likely trajectory if personal goals align.'
      : age < 50
      ? 'Long-term relationship stability is a reasonable expectation. Ongoing investment in communication, shared values, and mutual support tends to predict durable partnerships.'
      : 'Existing long-term partnerships may enter a phase of renewed appreciation and deeper companionship. Shared history and values tend to become the central pillars of connection.';

    return { type: pick(types), near, mid, longTerm };
  }

  /* ── Communication Style ──────────────────────────────────── */

  function getCommunicationStyle(age) {
    const base = [
      'Likely communicates more effectively in one-on-one settings than in large groups — common across most personality types.',
      'Tends to process thoughts internally before expressing them, which may sometimes be misread as hesitation.',
      'May rely on digital communication (text, messaging) as a primary channel, especially for sensitive topics.',
    ];

    const ageSpecific = age < 18
      ? [
          'Communication style is still actively developing and highly context-dependent at this stage.',
          'May struggle to articulate complex emotions verbally — a normal part of adolescent development.',
          'Peer-influenced language patterns are likely prominent and may shift significantly over the next few years.',
        ]
      : age < 28
      ? [
          'Likely becoming more assertive in expressing opinions as confidence builds through new experiences.',
          'May oscillate between over-sharing and under-sharing depending on the level of trust with the other person.',
          'Tends to communicate with energy and enthusiasm — though patience in conflict situations may still be developing.',
        ]
      : age < 45
      ? [
          'Tends to communicate with greater clarity and directness compared to earlier years.',
          'Likely more comfortable with difficult conversations, though may still prefer to avoid confrontation when possible.',
          'May use humor or storytelling as tools to connect — effective in both professional and personal settings.',
        ]
      : [
          'Tends to communicate with measured, considered language built from accumulated experience.',
          'Likely effective at reading interpersonal dynamics and adjusting communication style accordingly.',
          'May prefer depth and quality of conversation over frequency — small talk may feel less fulfilling.',
        ];

    return [...base, ...ageSpecific].sort(() => 0.5 - Math.random()).slice(0, 5);
  }

  /* ── Career Timeline ──────────────────────────────────────── */

  function getCareerTimeline(age) {
    const past = age < 18
      ? 'Currently in the academic foundation phase. Career-relevant skills are being built through formal education, extracurricular activities, and early exposure to different subjects.'
      : age < 25
      ? 'The education phase is either recently completed or ongoing. Early internships, part-time roles, or academic projects may have started to shape professional direction.'
      : age < 35
      ? 'Post-education career entry has likely occurred. Early professional experiences — including both successes and setbacks — have contributed to skill development and career self-awareness.'
      : 'A substantial portion of career experience has been accumulated. Professional identity is likely more clearly defined, with established skills and a growing track record.';

    const present = age < 18
      ? 'Currently in active skill-building mode, primarily through education. Career direction is still open and will likely become clearer over the next several years.'
      : age < 25
      ? 'Likely in the exploration and early decision phase of career. Experimenting with different roles, industries, or projects is common and often productive at this stage.'
      : age < 35
      ? 'Possibly engaged in a critical career decision phase — choosing whether to deepen expertise in a current path or pivot to a new direction.'
      : 'Likely in a consolidation or leadership development phase. Leveraging existing expertise while possibly managing or mentoring others.';

    const near = age < 18
      ? 'The near term will likely involve academic milestones and first meaningful exposure to career decision-making — such as university selection or vocational choices.'
      : age < 28
      ? 'Likely to involve exploring and testing multiple career options. Entry-level or mid-level role growth is probable. Building a professional network may become increasingly valuable.'
      : 'Near-term focus may include deepening specialization, pursuing credentials, or expanding leadership responsibilities within a current or new role.';

    const mid = age < 22
      ? 'The 3–5 year period is likely to include early career establishment — first meaningful roles, developing a professional reputation, and beginning to understand preferred work environments.'
      : age < 35
      ? 'Mid-term stabilization in a chosen career path is likely. Possible promotions, salary growth, or role transitions toward greater responsibility are plausible outcomes.'
      : 'Mid-term trajectory may include senior-level contribution, potential leadership roles, and a more focused professional identity.';

    const longTerm = age < 25
      ? 'Long-term financial stability and career fulfillment are achievable with sustained effort and intentional skill development. Career switching remains a viable possibility if early choices do not align well.'
      : age < 45
      ? 'Long-term growth in expertise and earning potential is likely, particularly if consistent skill development is maintained. Leadership or independent practice becomes a realistic possibility.'
      : 'Long-term career focus may shift toward legacy, mentorship, and selective high-impact contribution rather than continuous growth-oriented progression.';

    return { past, present, near, mid, longTerm };
  }

  /* ── Career Nature ────────────────────────────────────────── */

  function getCareerNature(age) {
    const styles = [
      'May thrive in structured environments with clear goals and measurable outcomes — systematic work tends to be satisfying.',
      'Likely comfortable in collaborative team settings, particularly those that value individual contribution alongside group outcomes.',
      'May show a natural inclination toward analytical problem-solving — roles that involve research, data, or systematic reasoning could be a strong fit.',
      'Tends to enjoy work that has visible, tangible impact — seeing the results of effort tends to sustain motivation.',
      'Possibly drawn to environments that offer creative freedom within a defined scope — structure with space to innovate.',
      'Likely values workplaces with clear communication norms, psychological safety, and reasonable autonomy.',
      'May prefer roles that involve human interaction and trust-building — service, education, counseling, or leadership-adjacent roles could be suitable.',
      'Tends to perform well under moderate pressure but may need recovery time after sustained high-stress periods.',
      'Possibly suited to roles that require careful attention to detail and quality rather than high-volume rapid output.',
      'Likely more productive in environments with flexibility in work process, even if outcomes are clearly defined.',
    ];

    return styles.sort(() => 0.5 - Math.random()).slice(0, 5);
  }

  /* ── Final Summary ────────────────────────────────────────── */

  function getFinalSummary(name, age, stage) {
    const firstName = name.trim().split(' ')[0];
    const intros = [
      `Based on current age and life stage, ${firstName} is likely navigating a period of`,
      `At this point in the life cycle, ${firstName}'s trajectory suggests a phase of`,
      `Drawing from typical patterns for this age group, ${firstName} appears to be in a period of`,
    ];
    const middles = {
      young:    'active formation — personally, academically, and socially. The choices made over the next few years will likely have disproportionate influence on longer-term outcomes. Relationships, education, and early career exposure are the most formative levers available right now.',
      emerging: 'active growth and early establishment. Career direction, relationship depth, and financial independence are likely becoming increasingly important. This period tends to be dynamic and filled with pivotal decisions that shape the following decade.',
      mid:      'professional consolidation and personal deepening. The foundations laid in earlier years are now being tested and refined. Stability in key relationships and career identity tends to increase during this phase, alongside a clearer sense of personal values.',
      senior:   'mature reflection and purposeful contribution. Long-established skills, relationships, and values form the core of daily life. The focus is likely shifting from accumulation to meaningful application of experience — in work, family, and community.',
    };
    const phase = age < 22 ? 'young' : age < 35 ? 'emerging' : age < 55 ? 'mid' : 'senior';
    return `${pick(intros)} ${middles[phase]}\n\nOverall, a trajectory of gradual, realistic progress is probable — marked by learning from setbacks, deepening key relationships, and progressively clearer self-understanding. No outcome is predetermined; consistency of effort and quality of choices remain the primary determinants of long-term wellbeing.`;
  }

  /* ── Public API ──────────────────────────────────────────── */

  function analyze(name, dob) {
    const age   = calcAge(dob);
    const stage = getLifeStage(age);
    return {
      meta: {
        name,
        dob,
        age,
        stage,
        initials: getInitials(name),
        generatedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      },
      coreNature:    getCoreNature(age),
      familyLife:    getFamilyLife(age),
      loveLife:      getLoveLife(age),
      communication: getCommunicationStyle(age),
      careerTimeline:getCareerTimeline(age),
      careerNature:  getCareerNature(age),
      summary:       getFinalSummary(name, age, stage),
    };
  }

  return { analyze, calcAge };

})();
