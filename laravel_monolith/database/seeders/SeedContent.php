<?php

namespace Database\Seeders;

/**
 * Realistic, non-gibberish content for seeding.
 */
final class SeedContent
{
    /** @return array<int, array{name: string, email: string}> */
    public static function users(): array
    {
        return [
            ['name' => 'Sarah Chen', 'email' => 'sarah.chen@example.com'],
            ['name' => 'Marcus Johnson', 'email' => 'marcus.johnson@example.com'],
            ['name' => 'Emma Williams', 'email' => 'emma.williams@example.com'],
            ['name' => 'James Okonkwo', 'email' => 'james.okonkwo@example.com'],
            ['name' => 'Olivia Martinez', 'email' => 'olivia.martinez@example.com'],
            ['name' => 'David Kim', 'email' => 'david.kim@example.com'],
            ['name' => 'Sophie Anderson', 'email' => 'sophie.anderson@example.com'],
            ['name' => 'Ryan Foster', 'email' => 'ryan.foster@example.com'],
            ['name' => 'Priya Patel', 'email' => 'priya.patel@example.com'],
            ['name' => 'Alex Rivera', 'email' => 'alex.rivera@example.com'],
        ];
    }

    /** @return array<int, array{title: string, body: string}> */
    public static function posts(): array
    {
        return [
            [
                'title' => 'How we reduced deployment time by half',
                'body' => "Our team used to spend over an hour on each production deploy. We moved to a container-based pipeline and cut that down to under thirty minutes. Here's what changed: we containerized our app, added a proper staging environment, and automated the rollback path. The biggest win was fixing flaky tests that had been blocking deploys.",
            ],
            [
                'title' => 'Choosing the right database for a new project',
                'body' => "Picking a database feels like a big decision, and it is. For most web apps, Postgres or MySQL will do. We chose Postgres for JSON support and good tooling. If you need full-text search or time-series data, look at specialized options. Don't over-engineer for day one.",
            ],
            [
                'title' => 'Why we switched our API to TypeScript',
                'body' => "We had a large JavaScript codebase and too many runtime type errors. Moving to TypeScript was gradual: we enabled it with allowJs, then started adding types to new code and critical paths. Within a few months we caught real bugs at build time. The migration took longer than we hoped but paid off.",
            ],
            [
                'title' => 'Setting up a useful code review process',
                'body' => "Code review only helps if it's consistent. We agreed on a checklist: tests, no debug code, and a short description. Reviews are done within one business day. We keep feedback focused on behavior and design, not style. Linters handle style.",
            ],
            [
                'title' => 'Lessons from our first major outage',
                'body' => "Last quarter we had a two-hour outage. Root cause was a bad config change that didn't get caught in staging. We now require all config changes to go through the same pipeline as code, and we run a canary for five minutes before full rollout. We also improved our runbooks.",
            ],
            [
                'title' => 'Building a simple monitoring dashboard',
                'body' => "You don't need a fancy stack to get value from metrics. We started with a few key metrics: latency, error rate, and queue depth. We exposed them from our app and sent them to a time-series store. A simple dashboard gave the team visibility and made it easier to spot regressions.",
            ],
            [
                'title' => 'Getting buy-in for technical debt work',
                'body' => "Technical debt work is hard to justify until something breaks. We started tracking high-interest areas and tying them to past incidents. When we proposed a dedicated sprint, we had data: X hours lost last quarter due to Y. That made the conversation much easier.",
            ],
            [
                'title' => 'Writing docs that stay up to date',
                'body' => "Docs that drift from the code are worse than no docs. We keep a single source of truth: the code and the OpenAPI spec generated from it. Our README points to that and to the runbooks. We review docs in the same PR as the feature. No separate doc repo.",
            ],
            [
                'title' => 'Running effective retrospectives',
                'body' => "We run a short retro every two weeks. We stick to three questions: what went well, what didn't, and what we'll try next. We limit the next actions to two or three so they actually get done. We rotate the facilitator so everyone gets practice.",
            ],
            [
                'title' => 'When to introduce a message queue',
                'body' => "We added a queue when we had more than one async job type and needed retries and backoff. Before that, a cron and a database table were enough. The queue added operational complexity, so we made sure we had basic monitoring and alerting first. Start simple.",
            ],
            [
                'title' => 'Improving test reliability',
                'body' => "Flaky tests were killing our confidence in CI. We tackled them by fixing timing issues first: no sleep(), use explicit waits or events. We then isolated tests so they don't share state. We also added a quarantine list for any test that flaked so we could fix it before re-enabling.",
            ],
            [
                'title' => 'A practical approach to feature flags',
                'body' => "We use feature flags for big releases and experiments. Each flag has an owner and a cleanup date. We avoid long-lived flags. We store them in our config system and evaluate in the app. When a feature is stable, we remove the flag and the old path in one PR.",
            ],
            [
                'title' => 'Scaling a small team without burning out',
                'body' => "We're a team of six. We said no to a lot of projects and focused on a few goals per quarter. We protect focus time and avoid back-to-back meetings. We also made it clear that after-hours work is the exception, not the norm. Sustainable pace beats heroics.",
            ],
            [
                'title' => 'Making the most of pair programming',
                'body' => "We pair on hard bugs and tricky design decisions, not on everything. The driver writes the code; the navigator thinks ahead and checks the approach. We switch roles every hour. We found that pairing works best when both people are familiar with the area. New folks pair with someone who knows the codebase.",
            ],
            [
                'title' => 'Security checklist for a new service',
                'body' => "Before we ship a new service we run through a short list: authentication and authorization, secrets in a vault not in code, HTTPS only, and logging that doesn't leak PII. We also run a dependency scan. It's not a full audit but it catches the most common issues.",
            ],
            [
                'title' => 'What we learned from a failed migration',
                'body' => "We tried to migrate our main app to a new framework in one go. It didn't work. We learned to do incremental migrations: strangle the old code path piece by piece, ship often, and keep both paths working until the old one is gone. Big-bang rewrites are too risky.",
            ],
            [
                'title' => 'Onboarding new developers',
                'body' => "We give new hires a small, well-defined task in their first week so they can open a PR and learn our flow. We assign a buddy for questions. We also maintain an onboarding doc that lists repos, how to run things locally, and who owns what. We update it every time someone gets stuck.",
            ],
            [
                'title' => 'Handling legacy code safely',
                'body' => "We don't rewrite legacy code from scratch. We add tests around the behavior we need to change, then refactor. We use feature flags to ship changes gradually. We document the weird bits as we touch them. Over time the code gets better without a single risky release.",
            ],
            [
                'title' => 'Choosing between monolith and microservices',
                'body' => "We stayed with a monolith until we had clear boundaries and a real need to scale parts independently. Splitting too early gave us operational overhead without clear benefit. If you have a small team and one deployable unit, a well-structured monolith is often the right choice.",
            ],
            [
                'title' => 'Building a culture of incident response',
                'body' => "We treat incidents as learning opportunities. We have a simple process: mitigate first, then fix, then write a short postmortem. We focus on systems and process, not blame. We share postmortems with the whole team and run a quarterly review of patterns we're seeing.",
            ],
            [
                'title' => 'Getting value from logging',
                'body' => "We log structured JSON with a request id, user id when relevant, and a short message. We avoid logging huge payloads or secrets. We have one place to search logs and set up alerts on error rate and latency. Good logging has saved us hours during debugging.",
            ],
            [
                'title' => 'Why we standardized on one language',
                'body' => "We had two languages in the backend and it made hiring and context-switching harder. We chose one and migrated the smaller service. Now everyone can work across the stack. The migration was painful but we're more productive. Standardizing doesn't mean you can't use the right tool for a one-off script.",
            ],
            [
                'title' => 'Keeping dependencies up to date',
                'body' => "We update dependencies in small batches every two weeks. We run tests and a quick smoke check. We track security advisories and prioritize those. We avoid upgrading multiple major versions at once. Regular small updates are easier than occasional big jumps.",
            ],
            [
                'title' => 'Designing APIs for frontend developers',
                'body' => "We design our APIs so the frontend can get what it needs in one or two calls. We avoid over-fetching and under-fetching by offering a few well-shaped endpoints. We version the API and document it with examples. We also have a sandbox so frontend can develop without the full backend.",
            ],
            [
                'title' => 'Making the case for automated backups',
                'body' => "We backup our database and key blobs daily. We test restore at least once a quarter. We keep backups in a different region. It's boring work until you need it. We had one close call and since then we've treated backups as non-negotiable.",
            ],
            [
                'title' => 'Running productive standups',
                'body' => "We keep standups to ten minutes. Everyone answers: what did I do, what's next, any blockers. Blockers get a follow-up right after. We do it at the same time every day. We tried async standups but we lost the quick unblocking. Short and consistent works for us.",
            ],
            [
                'title' => 'When to build vs buy',
                'body' => "We buy when the product is core to someone else's business and we'd be maintaining a commodity. We build when it's a differentiator or when no product fits. We've been wrong both ways. The key is to reassess as the product and team change. Don't fall in love with build or buy.",
            ],
            [
                'title' => 'Improving our release process',
                'body' => "We used to release on Fridays and regretted it more than once. We moved to Tuesday and Thursday releases with a clear cutoff. We also added a release captain role that rotates. One person runs the release and communicates status. Fewer surprises and fewer weekend fixes.",
            ],
            [
                'title' => 'Managing environment configuration',
                'body' => "We keep one config file per environment with overrides, and we never commit secrets. Secrets live in a vault and are injected at runtime. We validate config on startup so we fail fast. We've had fewer environment-specific bugs since we tightened this up.",
            ],
            [
                'title' => 'What makes a good bug report',
                'body' => "A good bug report has steps to reproduce, expected vs actual behavior, and environment. We ask for a screenshot or log snippet when it helps. We use a template in our issue tracker. Good reports get fixed faster; vague ones bounce back. We reward clarity.",
            ],
        ];
    }

    /** @return array<int, string> */
    public static function commentBodies(): array
    {
        return [
            'This was really helpful, thanks for writing it.',
            'We ran into the same issue last month. Your approach makes sense.',
            'Could you expand on the section about deployment?',
            'We did something similar and it saved us a lot of time.',
            'Good point about keeping it simple first.',
            'We tried this and hit a snag with our legacy stack. Any tips?',
            'The checklist idea is great. We’re going to try it.',
            'We’re in the middle of a similar migration. Good to see we’re on the right track.',
            'Our team has been debating this. I’m sharing your post with them.',
            'The part about rollback is so important. We learned that the hard way.',
            'We’ve been putting off this kind of work. This is a nudge we needed.',
            'Nice write-up. How long did the full migration take for you?',
            'We had a different experience with the tooling. Would be curious to compare notes.',
            'The runbook tip is underrated. We updated ours after our last incident.',
            'We’re a small team too. This approach seems doable for us.',
            'I’ve been looking for a practical take on this. Thanks.',
            'We’re about to start something similar. Bookmarking this.',
            'The incremental approach is the only way we’ve made progress on legacy code.',
            'Our retrospectives needed this. Going to suggest we try it.',
            'We use feature flags the same way. Cleanup dates are key.',
            'Good call on not over-engineering early. We did the opposite once and regretted it.',
            'The security checklist is going into our onboarding doc.',
            'We standardized on one language last year. Same conclusion.',
            'Pairing on the hard stuff only has worked well for us too.',
            'Docs in the same PR as the feature has been a game changer.',
            'We moved releases off Friday and it reduced stress a lot.',
            'Backups are boring until you need them. Good reminder.',
            'We’ve been improving our logging. The request id tip is solid.',
            'The buy-in section is exactly what I needed for my next proposal.',
            'We’re still working on our incident culture. This helps.',
            'Testing restores is something we keep postponing. Going to schedule it.',
            'The “when to introduce” framing is useful. We might have added our queue too early.',
            'Our standups were running long. We’ll try the ten-minute rule.',
            'Good distinction between build and buy. We’ve swung both ways.',
            'The bug report template is a good idea. We’ll adopt something like it.',
            'Environment config has bitten us before. Validating on startup is smart.',
            'We’re looking at this for our next project. Helpful overview.',
            'The onboarding doc tip is one we’ll use. Ours is out of date.',
            'We had a failed migration too. Incremental is the way.',
            'Monitoring doesn’t have to be fancy. This is a good starting point.',
            'Code review consistency is something we’re still working on.',
            'Sustainable pace over heroics is how we want to run.',
            'The release captain rotation has helped us. Recommend it.',
            'Dependency updates in small batches is what we do now. Much easier.',
            'API design for frontend is something we’re improving. Good pointers.',
            'We’re doing more pair programming. The role switch every hour helps.',
            'Postmortems without blame have changed how we handle incidents.',
            'The strangle-the-old-code approach is what we’re using. It works.',
            'Good to see someone else advocating for a monolith first.',
            'The canary idea is something we’re adding to our pipeline.',
            'We’ve been meaning to fix our flaky tests. This is a good plan.',
            'Feature flag ownership and cleanup dates—we’re adding both.',
            'The three questions for retros are simple but effective.',
        ];
    }
}
