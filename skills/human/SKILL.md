---
name: human
description: Surya's personal humanizer. Strips AI-typical writing patterns (from Wikipedia's "Signs of AI writing") from any text and produces natural, human-sounding prose. ALWAYS use this skill when the user types /human, says "humanize", "make this sound human", "make this less AI", "rewrite this so it doesn't sound like ChatGPT/AI", or asks you to write anything they'll publish under their own name (emails, LinkedIn posts, app store copy, SOPs, reviewer notes, blog posts, README text, application essays). Also use it when reviewing text to flag AI tells.
---

# Human

Rewrite or produce text that reads like a real person wrote it. The reference standard is Wikipedia's "Signs of AI writing" page (WP:AISIGNS), maintained by WikiProject AI Cleanup. The goal is not to evade detectors; it is to remove the lazy, formulaic habits that make writing feel generic.

## Modes

**Rewrite mode** — the user pastes text (or points to a file). Rewrite it fully. Preserve meaning, facts, names, numbers, and links exactly. Change only the prose. If asked, also list which patterns you removed.

**Compose mode** — the user asks for new writing (email, post, doc, essay). Apply every rule below while drafting. Never draft first in default style and "clean up" after; write it human from the start.

**Audit mode** — the user asks "does this sound AI?" Don't rewrite. Point to the specific lines that trip the patterns below and say which pattern each one is.

## Patterns to eliminate

### Language and tone

1. **Inflated importance.** Kill "stands as a testament to", "plays a vital/pivotal role", "underscores its significance", "reflects broader trends", "cementing its place". If a fact matters, state the fact; the reader decides if it's significant.
2. **Puffery.** No "breathtaking", "vibrant", "rich cultural heritage", "nestled in the heart of", "stunning", "seamless", "cutting-edge". Replace with a concrete detail or delete.
3. **Editorializing.** No "it's important to note", "it's worth mentioning", "notably". Just say the thing.
4. **Trailing participle analysis.** Sentences must not end with ", highlighting X", ", ensuring Y", ", showcasing Z", ", emphasizing W". End the sentence at the fact. If the implication matters, give it its own plain sentence.
5. **Vague attribution.** No "some critics argue", "experts say", "industry reports suggest", "observers have noted" without a named source. Either name who said it or own the claim directly.
6. **Misconception framing.** Don't open with "Despite common belief..." or write as if correcting the reader unless there is an actual, stated misconception in play.
7. **Negative parallelism.** No "It's not just X, it's Y", "not only... but also", "This isn't about X. It's about Y." Say what it is.
8. **Rule of three.** Don't reflexively list three adjectives, three benefits, three examples ("fast, reliable, and scalable"). Use one strong word, or two, or four — whatever the content actually needs.
9. **Elegant variation.** Repeating a word is fine. Don't cycle through synonyms ("the app... the platform... the solution... the tool") to avoid repetition.
10. **False ranges.** No decorative "from X to Y" spans ("from students to professionals") unless describing a real, meaningful range.
11. **AI vocabulary.** Banned unless quoting someone: delve, tapestry, landscape (metaphorical), pivotal, crucial, intricate, foster, leverage (as a verb), boast, showcase, testament, comprehensive, robust (outside engineering contexts), ever-evolving, "in the realm of", "in today's fast-paced world", elevate, empower, unlock, journey (metaphorical), game-changer, paradigm shift.

### Structure

12. **Compulsive summaries.** Never end with "In summary", "In conclusion", "Overall", or a paragraph that restates what was just said. End on the last substantive point.
13. **Wrap-up value judgments.** No closing sentence that grades the subject ("...making it an excellent choice for anyone looking to...").
14. **Formulaic sections.** Don't default to generic "Challenges / Benefits / Future Prospects / Conclusion" scaffolding. Let the content dictate the sections, if sections are needed at all.
15. **Template paragraphs.** Vary sentence length and paragraph shape. If every paragraph is 3–4 sentences following claim → elaboration → implication, break the rhythm. Short sentences are allowed. Fragments occasionally, too.

### Formatting

16. **Bolding.** No bolding key terms mid-sentence. Bold almost nothing.
17. **Lists.** Default to prose. Use a bullet list only when the content is genuinely enumerable (steps, options, specs) or the user asks. Never bolded-label bullets ("**Speed:** the app is fast") in prose-appropriate contexts.
18. **Headings.** Sentence case, not Title Case. No emojis in headings or lists. No "X: A Journey Through Y" colon titles.
19. **Em dashes.** Allowed sparingly — at most one per few paragraphs, and only where a comma or parentheses wouldn't do. When in doubt, use a comma.
20. **Quotes and apostrophes.** Straight quotes (' ") not curly (' ' " ").

### Chatbot residue

21. No "I hope this helps", "Certainly!", "Great question", "Would you like me to...", "as of my last update", "as an AI".
22. No unfilled placeholders like [insert name].
23. No markdown syntax in contexts that don't render it (plain-text emails, app store descriptions, form fields).

## What to write instead

- Lead with the specific: numbers, names, dates, concrete nouns. "Reduced eval runtime from 40 min to 12" beats "significantly improved performance".
- Write like Surya talks: direct, technically fluent, no throat-clearing. First sentence carries real content.
- One idea per sentence when the idea is important. Combine only when sentences are trivially related.
- Verbs over nominalizations: "we decided" not "a decision was made"; "this fixes" not "this provides a resolution for".
- Mild imperfection is human: starting a sentence with "But" or "And", a parenthetical aside, an opinion stated as an opinion ("I think this is the wrong tradeoff").
- Indian English spellings and idiom are fine when the audience is Indian; match the audience otherwise.

## Nuance

These are patterns, not banned words. A single em dash, one bullet list in a spec doc, or the word "crucial" in a sentence that earns it are all fine. What must go is the reflexive, decorative, formulaic use. If a rule above would make a specific sentence worse or less accurate, break the rule and keep the meaning.

## Final self-check (always run before delivering)

Scan the draft once for: any sentence ending in a participle clause, any "not just X but Y", any triplet list, any banned vocabulary word, any bolded mid-sentence term, any summary paragraph, more than one em dash per ~150 words. Fix hits, then deliver. Don't announce the check.
