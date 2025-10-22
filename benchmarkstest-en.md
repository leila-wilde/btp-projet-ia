# Generative AI Benchmarks

This document provides a comprehensive and structured overview of different generative AI options for code, text, and media.

## 📊 Overview

This file documents:
- Generative AI for **code** (available assistance modes)
- Generative AI for **text** (performance, use cases, benchmarks)
- Generative AI for **media** (image, sound, video, 3D)
- Comparison of costs, performance, and limitations

---

## 💻 1. Generative AI for Code

### 1.1 Available Assistance Modes

#### 1.1.1 Code Completion (IDE Integration)

| Tool | Supported Editors | Price | Key Features |
|------|------------------|-------|--------------|
| **GitHub Copilot** | VS Code, JetBrains, Neovim, Visual Studio | $10/month or $100/year (free for students) | • Contextual suggestions<br>• Multi-language<br>• Based on OpenAI Codex |
| **Tabnine** | VS Code, JetBrains, Sublime, Vim | Free (basic) / $12/month (Pro) | • Works offline<br>• Privacy-focused<br>• Customizable |
| **Amazon CodeWhisperer** | VS Code, JetBrains, AWS Cloud9 | Free (Individual) / Included in AWS | • Optimized for AWS<br>• Integrated security scan<br>• 15+ languages support |
| **Codeium** | VS Code, JetBrains, and 40+ editors | Free for individuals | • Fast completion<br>• Integrated chat<br>• 70+ languages support |
| **Cursor** | Standalone application (VS Code fork) | Free / $20/month (Pro) | • All-in-one editor<br>• Ctrl+K for edits<br>• Contextual chat |

**Advantages:**
- Seamless integration into workflow
- Time savings on repetitive code
- Real-time contextual suggestions

**Disadvantages:**
- May generate incorrect or non-optimal code
- Internet dependency (except Tabnine)
- Code privacy concerns

#### 1.1.2 Programming Chatbots

| Tool | Underlying Model | Price | Strengths | Weaknesses |
|------|-----------------|-------|-----------|------------|
| **ChatGPT** (GPT-4) | GPT-4, GPT-4 Turbo | $20/month (Plus) | • Excellent understanding<br>• Detailed explanations<br>• Multi-language | • Limited to 40 msgs/3h (GPT-4)<br>• No project code access |
| **Claude** (Anthropic) | Claude 3 Opus/Sonnet | $20/month (Pro) | • 200K token context<br>• Excellent for refactoring<br>• Enhanced security | • Can be more conservative<br>• Geographic availability |
| **Gemini** (Google) | Gemini Ultra/Pro | Free / $20/month (Advanced) | • Google Workspace integration<br>• Multi-modal<br>• 1M token context (Pro 1.5) | • Less performant on complex code |
| **Perplexity** | Mixtral, GPT-4, Claude | Free / $20/month (Pro) | • Real-time search<br>• Cited sources | • Less specialized in code |
| **Phind** | Proprietary model | Free / $20/month (Pro) | • Development-specialized<br>• Integrated web search | • Smaller user base |

**Advantages:**
- Detailed and educational explanations
- Debugging and architecture assistance
- Test and documentation generation

**Disadvantages:**
- Requires code copy-paste
- No direct project access
- Limited context (except Claude and Gemini)

#### 1.1.3 CLI (Command Line Interface)

| Tool | Model | Price | Use Cases |
|------|-------|-------|-----------|
| **GitHub Copilot CLI** | GPT-4 | Included in Copilot | • Shell commands<br>• Git scripts<br>• Command explanation |
| **Warp AI** | GPT-4 | Free (limited) / $20/month | • Modern terminal<br>• Command search<br>• Script generation |
| **Fig** | Proprietary | Free | • CLI autocompletion<br>• Inline documentation |

**Advantages:**
- Quick access from terminal
- Complex command generation
- Obscure command explanation

**Disadvantages:**
- Limited to terminal context
- Requires learning AI commands

#### 1.1.4 Autonomous Agents / Assistants

| Tool | Capabilities | Price | Autonomy Level |
|------|-------------|-------|----------------|
| **GitHub Copilot Workspace** | Planning, implementation, PR | In beta | 🟢🟢🟢 High |
| **Devin** (Cognition AI) | Autonomous full-stack dev | Limited access | 🟢🟢🟢🟢 Very High |
| **GPT Engineer** | Complete project generation | Open source (free) | 🟢🟢 Medium |
| **Cursor Agent** | Multi-file edits | $20/month | 🟢🟢🟢 High |
| **Continue.dev** | Open-source agent | Free | 🟢🟢 Medium |

**Advantages:**
- Complex task automation
- Global project vision
- Drastic development time reduction

**Disadvantages:**
- Requires supervision
- May produce hard-to-maintain code
- High token cost

### 1.2 Performance Benchmarks (Code)

#### 1.2.1 HumanEval (Python Problem Solving)

| Model | HumanEval Score | Date |
|-------|----------------|------|
| GPT-4 Turbo | 87.6% | 2024 |
| Claude 3 Opus | 84.9% | 2024 |
| GPT-4 | 67.0% | 2023 |
| Claude 3.5 Sonnet | 92.0% | 2024 |
| Gemini 1.5 Pro | 71.9% | 2024 |
| CodeLlama 70B | 67.8% | 2023 |

#### 1.2.2 MBPP (Mostly Basic Programming Problems)

| Model | MBPP Score | Language |
|-------|-----------|----------|
| GPT-4 | 86.8% | Python |
| Claude 3.5 Sonnet | 90.7% | Python |
| Gemini Ultra | 87.2% | Python |

#### 1.2.3 MultiPL-E (Multi-language)

Code generation support across 18+ programming languages.

**Top Performers:**
1. Claude 3.5 Sonnet
2. GPT-4 Turbo
3. Claude 3 Opus

### 1.3 Cost Comparison

#### Monthly Costs (Individual Usage)

| Category | Free | ~$10/month | ~$20/month | Enterprise |
|----------|------|-----------|-----------|------------|
| **IDE Completion** | Codeium, CodeWhisperer | GitHub Copilot, Tabnine | Cursor Pro | Variable |
| **Chatbot** | ChatGPT 3.5, Gemini | - | ChatGPT Plus, Claude Pro, Gemini Advanced | $25-60/user/month |
| **CLI** | Fig | - | Warp AI | - |

#### API Costs (per million tokens)

| Model | Input | Output |
|-------|-------|--------|
| GPT-4 Turbo | $10 | $30 |
| GPT-4 | $30 | $60 |
| Claude 3 Opus | $15 | $75 |
| Claude 3 Sonnet | $3 | $15 |
| Gemini Pro | Free (limited) | Free (limited) |

### 1.4 Recommendations by Use Case

| Use Case | Recommended Tool | Reason |
|----------|-----------------|--------|
| Daily development | GitHub Copilot + Cursor | Best integration |
| Learning | ChatGPT / Claude | Detailed explanations |
| Complex refactoring | Claude 3.5 Sonnet | Large context (200K tokens) |
| Rapid prototyping | Cursor + GPT-4 | Fast generation |
| AWS code | CodeWhisperer | AWS-optimized |
| Open source / Privacy | Codeium + Continue.dev | Free and privacy-respectful |

---

## 📝 2. Generative AI for Text

### 2.1 Main Language Models

#### 2.1.1 Proprietary Models (Closed-source)

| Model | Developer | Parameters | Context | Price |
|-------|-----------|-----------|---------|-------|
| **GPT-4 Turbo** | OpenAI | Undisclosed (~1.7T estimated) | 128K tokens | $10-30/1M tokens |
| **GPT-4** | OpenAI | Undisclosed | 8K/32K tokens | $30-60/1M tokens |
| **Claude 3 Opus** | Anthropic | Undisclosed | 200K tokens | $15-75/1M tokens |
| **Claude 3 Sonnet** | Anthropic | Undisclosed | 200K tokens | $3-15/1M tokens |
| **Claude 3 Haiku** | Anthropic | Undisclosed | 200K tokens | $0.25-1.25/1M tokens |
| **Gemini Ultra** | Google | Undisclosed | 1M tokens | Variable |
| **Gemini Pro** | Google | Undisclosed | 1M tokens | Free (limited) |
| **Gemini Flash** | Google | Undisclosed | 1M tokens | Cheaper than Pro |

#### 2.1.2 Open-source Models

| Model | Developer | Parameters | Context | Availability |
|-------|-----------|-----------|---------|--------------|
| **Llama 3** | Meta | 8B, 70B, 405B | 8K tokens | HuggingFace, Ollama |
| **Mistral** | Mistral AI | 7B | 32K tokens | Open weights |
| **Mixtral 8x7B** | Mistral AI | 47B (8x7B MoE) | 32K tokens | Open weights |
| **Mixtral 8x22B** | Mistral AI | 141B (8x22B MoE) | 64K tokens | Open weights |
| **Phi-3** | Microsoft | 3.8B, 7B, 14B | 128K tokens | Open weights |
| **Gemma** | Google | 2B, 7B | 8K tokens | Open weights |

### 2.2 Relevant Benchmarks

#### 2.2.1 MMLU (Massive Multitask Language Understanding)

Evaluates general understanding across 57 domains (mathematics, history, law, medicine...).

| Model | MMLU Score | Date |
|-------|-----------|------|
| GPT-4 | 86.4% | 2023 |
| Claude 3 Opus | 86.8% | 2024 |
| Claude 3.5 Sonnet | 88.7% | 2024 |
| Gemini Ultra | 90.0% | 2024 |
| Gemini Pro 1.5 | 85.9% | 2024 |
| Llama 3 405B | 87.3% | 2024 |
| Llama 3 70B | 82.0% | 2024 |
| Mixtral 8x22B | 77.8% | 2024 |

#### 2.2.2 GPQA (Graduate-Level Questions)

PhD-level questions in physics, biology, and chemistry.

| Model | GPQA Score | Level |
|-------|-----------|-------|
| Claude 3 Opus | 50.4% | Expert |
| GPT-4 Turbo | 49.3% | Expert |
| Gemini Ultra | 59.4% | Expert |
| Claude 3.5 Sonnet | 59.4% | Expert |

#### 2.2.3 HellaSwag (Common Sense)

Evaluates common sense reasoning ability.

| Model | HellaSwag Score |
|-------|----------------|
| GPT-4 | 95.3% |
| Claude 3 Opus | 95.4% |
| Llama 3 70B | 85.5% |

#### 2.2.4 TruthfulQA (Truthfulness)

Evaluates ability to avoid misinformation.

| Model | TruthfulQA Score |
|-------|-----------------|
| GPT-4 | 59.0% |
| Claude 3 Opus | 54.9% |
| Gemini Pro | 45.7% |

#### 2.2.5 GSM8K (School-level Mathematics)

| Model | GSM8K Score |
|-------|------------|
| GPT-4 | 92.0% |
| Claude 3 Opus | 95.0% |
| Claude 3.5 Sonnet | 96.4% |
| Gemini Ultra | 94.4% |
| Llama 3 70B | 93.0% |

### 2.3 Specialization by Task Type

#### 2.3.1 Creative Writing and Storytelling

**Best Models:**
1. **Claude 3 Opus** - Natural style, narrative coherence
2. **GPT-4** - Creativity, style diversity
3. **Gemini Ultra** - Long narratives

#### 2.3.2 Document Analysis and Summarization

**Best Models:**
1. **Claude 3.5 Sonnet** - 200K context, excellent synthesis
2. **Gemini Pro 1.5** - 1M context, multi-modal
3. **GPT-4 Turbo** - 128K context

#### 2.3.3 Translation

**Best Models:**
1. **GPT-4** - Wide language coverage
2. **Claude 3 Opus** - Cultural nuances
3. **Gemini Pro** - Google Translate integration

#### 2.3.4 Complex Reasoning and Logic

**Best Models:**
1. **Claude 3.5 Sonnet** - Best on GPQA and reasoning
2. **GPT-4** - Excellent multi-step reasoning
3. **Gemini Ultra** - Strong on academic questions

#### 2.3.5 Conversation and Customer Support

**Best Models:**
1. **GPT-4 Turbo** - Versatile, fast
2. **Claude 3 Haiku** - Fast, economical
3. **Gemini Flash** - Very fast, economical

#### 2.3.6 Marketing Content Generation

**Best Models:**
1. **GPT-4** - Creative, persuasive
2. **Claude 3 Sonnet** - Professional tone
3. **Jasper** (GPT-based) - Marketing-specialized

#### 2.3.7 Sentiment Analysis and Moderation

**Best Models:**
1. **GPT-4 Turbo** - Emotional nuances
2. **Claude 3** - Safety and ethics
3. **Perspective API** (Google) - Moderation-specialized

### 2.4 Cost/Performance Comparison

#### Subscription Usage

| Service | Monthly Price | Model | Limitations |
|---------|--------------|-------|-------------|
| ChatGPT Plus | $20 | GPT-4, GPT-4 Turbo | 40 msgs/3h (GPT-4) |
| Claude Pro | $20 | Claude 3 Opus, Sonnet, Haiku | 5x more messages |
| Gemini Advanced | $20 | Gemini Ultra | Integrated Google One (2TB) |
| Perplexity Pro | $20 | Access GPT-4, Claude, Mixtral | 300+ searches/day |

#### API Usage

| Model | Input ($/1M tokens) | Output ($/1M tokens) | Speed | Optimal Use Case |
|-------|-------------------|---------------------|-------|------------------|
| GPT-4 Turbo | $10 | $30 | Medium | Balanced production |
| GPT-3.5 Turbo | $0.50 | $1.50 | Fast | High volume |
| Claude 3 Opus | $15 | $75 | Slow | Complex tasks |
| Claude 3 Sonnet | $3 | $15 | Medium | Best quality/price ratio |
| Claude 3 Haiku | $0.25 | $1.25 | Very fast | High volume |
| Gemini Pro | Free (limited) | Free (limited) | Fast | Testing, prototyping |
| Gemini Flash | $0.35 (after quota) | $1.05 | Very fast | High volume |

### 2.5 Local Models (Self-hosted)

#### Advantages
- Complete privacy
- No recurring costs
- Customizable

#### Disadvantages
- Requires powerful GPU infrastructure
- Lower performance than cloud models
- Technical maintenance

#### Recommended Options

| Model | Minimum VRAM | Performance vs GPT-4 | Deployment Tool |
|-------|-------------|---------------------|-----------------|
| Llama 3 8B | 6GB | ~40% | Ollama, LM Studio |
| Llama 3 70B | 48GB (quantized: 24GB) | ~75% | Ollama, vLLM |
| Mistral 7B | 8GB | ~35% | Ollama, LM Studio |
| Mixtral 8x7B | 24GB (quantized: 16GB) | ~60% | Ollama, vLLM |
| Phi-3 14B | 8GB | ~50% | Ollama, LM Studio |

### 2.6 Recommendations by Use Case (Text)

| Use Case | Recommended Model | Alternative | Reason |
|----------|------------------|-------------|--------|
| Long writing | Claude 3.5 Sonnet | Gemini Pro 1.5 | Large context |
| Production chatbot | GPT-4 Turbo | Claude 3 Haiku | Perf/cost balance |
| Document analysis | Claude 3 Opus | Gemini Pro 1.5 | Context + precision |
| High volume | Claude 3 Haiku | GPT-3.5 Turbo | Low cost |
| Web search | Perplexity | Gemini Pro | Cited sources |
| Privacy | Llama 3 70B (local) | Mixtral 8x7B | Open source |
| Creativity | GPT-4 | Claude 3 Opus | Output diversity |
| Reasoning | Claude 3.5 Sonnet | GPT-4 | Best on benchmarks |
| Multilingual | GPT-4 | Gemini Pro | Language coverage |

---

## 🎨 3. Generative AI for Media

### 3.1 Image Generation

#### 3.1.1 Main Models

| Model | Developer | Access | Price | Quality | Speed |
|-------|-----------|--------|-------|---------|-------|
| **DALL-E 3** | OpenAI | API, ChatGPT Plus | $0.04-0.12/image | 🟢🟢��🟢 | Medium |
| **Midjourney v6** | Midjourney | Discord | $10-120/month | 🟢🟢🟢🟢🟢 | Medium |
| **Stable Diffusion XL** | Stability AI | API, Open source | Free (local) / $0.03/image | 🟢🟢🟢🟢 | Fast |
| **Adobe Firefly** | Adobe | Web, Adobe CC | Included CC / Free (limited) | 🟢🟢🟢🟢 | Fast |
| **Ideogram** | Ideogram AI | Web | Free / $8-48/month | 🟢🟢🟢🟢 | Medium |
| **Leonardo AI** | Leonardo | Web, API | Free / $10-48/month | 🟢🟢🟢🟢 | Fast |
| **Flux.1** | Black Forest Labs | API, Local | Free (Pro: paid) | 🟢🟢🟢🟢🟢 | Variable |

#### 3.1.2 Detailed Comparison

##### DALL-E 3
**Strengths:**
- Excellent understanding of complex prompts
- Coherence with instructions
- Integrated in ChatGPT Plus

**Weaknesses:**
- High cost at scale
- Less creative control than Midjourney
- Limitations on sensitive content

**Pricing:**
- Standard (1024×1024): $0.04/image
- HD (1024×1792): $0.08/image

**Use Cases:** Precise illustrations, marketing concepts, visual prototypes

##### Midjourney v6
**Strengths:**
- Best overall artistic quality
- Very diverse styles
- Active community with examples

**Weaknesses:**
- Discord interface only (no public API)
- Prompt learning curve
- No personal fine-tuning

**Pricing:**
- Basic: $10/month (~200 images)
- Standard: $30/month (~900 images, relaxed mode)
- Pro: $60/month
- Mega: $120/month

**Use Cases:** Concept art, high-end marketing visuals, stylized illustrations

##### Stable Diffusion XL (SDXL)
**Strengths:**
- Open source (customizable)
- Can run locally
- Large ecosystem of fine-tuned models
- Full control (ControlNet, LoRA, etc.)

**Weaknesses:**
- Requires powerful GPU (local)
- Technical configuration
- Variable quality by model

**Pricing:**
- Free (local with GPU)
- Stability AI API: ~$0.03/image

**Recommended GPU:** RTX 3060 12GB minimum, RTX 4090 optimal

**Use Cases:** Large-scale production, confidential projects, experimentation

#### 3.1.3 Image Editing

| Tool | Function | Quality | Price |
|------|----------|---------|-------|
| **Photoshop Generative Fill** | Inpainting, extension | 🟢🟢🟢🟢 | $60/month CC |
| **ClipDrop** | Background removal, upscale | 🟢🟢🟢🟢 | Free / $9/month |
| **Magnific AI** | Intelligent upscaling | 🟢🟢🟢🟢🟢 | $40-200/month |
| **Topaz Photo AI** | Upscale, denoise | 🟢🟢🟢🟢 | $199 (one-time) |
| **Remove.bg** | Background removal | 🟢🟢🟢🟢 | Free / $9/month |

#### 3.1.4 Current Limitations

**Common Limitations:**
- ❌ Hands and fingers (improving)
- ❌ Precise text (except Ideogram)
- ❌ Multi-image coherence (same character)
- ❌ Exact proportions/perspectives
- ⚠️ Representation biases
- ⚠️ Sensitive content blocked

**Expected Evolution:**
- ✅ Character coherence improvement (ongoing)
- ✅ Better spatial understanding
- ✅ Video generation from images
- ✅ More precise editing

### 3.2 Video Generation

#### 3.2.1 Main Models

| Model | Developer | Access | Price | Quality | Max Duration |
|-------|-----------|--------|-------|---------|--------------|
| **Sora** | OpenAI | Limited access | Not public | 🟢🟢🟢🟢🟢 | 60s |
| **Runway Gen-3** | Runway | Web, API | $12-76/month | 🟢🟢🟢🟢 | 10s |
| **Pika 1.0** | Pika Labs | Web | Free / $8-58/month | 🟢🟢🟢 | 3s |
| **Stable Video Diffusion** | Stability AI | Open source, API | Free / paid | 🟢🟢🟢 | 4s |
| **Synthesia** | Synthesia | Web | $22-67/month | 🟢🟢🟢🟢 | Unlimited |
| **HeyGen** | HeyGen | Web | $24-240/month | 🟢🟢🟢🟢 | Unlimited |

#### 3.2.2 Current Limitations

**Major Limitations:**
- ❌ Very limited duration (3-10s generally)
- ❌ High cost (>$0.05/second)
- ❌ Complex action coherence
- ❌ Recurring characters difficult
- ❌ Text in video
- ⚠️ Sometimes incorrect physics

**Expected Evolution (2024-2025):**
- ✅ Longer durations (Sora: 60s)
- ✅ Better temporal coherence
- ✅ Decreasing costs
- ✅ Improved camera control

### 3.3 Audio Generation

#### 3.3.1 Voice Synthesis (Text-to-Speech)

| Model | Developer | Quality | Languages | Price | Use Cases |
|-------|-----------|---------|-----------|-------|-----------|
| **ElevenLabs** | ElevenLabs | 🟢🟢🟢🟢🟢 | 29+ | Free / $5-330/month | Natural voices, audiobooks |
| **OpenAI TTS** | OpenAI | 🟢🟢🟢🟢 | Multi | $15/1M chars | Voice assistants |
| **Azure TTS** | Microsoft | 🟢🟢🟢🟢 | 100+ | $16/1M chars | Enterprise |
| **Google TTS** | Google | 🟢🟢🟢 | 50+ | $16/1M chars | Google integration |

**Best:** ElevenLabs for naturalness and emotions

#### 3.3.2 Music Generation

| Model | Developer | Access | Price | Quality | Duration |
|-------|-----------|--------|-------|---------|----------|
| **Suno v3.5** | Suno AI | Web | Free / $8-30/month | 🟢🟢🟢🟢 | 4min |
| **Udio** | Udio | Web | Free / $10-30/month | 🟢🟢🟢🟢 | 15min |
| **MusicGen** | Meta | Open source | Free | 🟢🟢🟢 | 30s |
| **Stable Audio** | Stability AI | API | Free / paid | 🟢🟢🟢 | 90s |

### 3.4 3D Generation

#### 3.4.1 3D Models from Text

| Tool | Input | Output | Quality | Price |
|------|-------|--------|---------|-------|
| **Shap-E** | Text/Image | 3D Mesh | 🟢🟢🟢 | Open source (OpenAI) |
| **Meshy.ai** | Text/Image | 3D Mesh | 🟢🟢🟢 | $20-60/month |
| **Luma AI** | Video | NeRF/Mesh | 🟢🟢🟢🟢 | Free / $30/month |
| **Polycam** | Photos | 3D scan | 🟢🟢🟢🟢 | Free / $20/month |

**General 3D Limitations:**
- ❌ Pure text generation still limited
- ⚠️ Best results with real images/videos
- ❌ Complex objects difficult
- ⚠️ Requires 3D skills for finalization

---

## 📊 4. Summary and Global Recommendations

### 4.1 Monthly Budget by Use Case

#### Solo Developer

| Need | Tools | Monthly Cost |
|------|-------|-------------|
| **Minimal** | Codeium + Free ChatGPT + Stable Diffusion (local) | $0 |
| **Standard** | GitHub Copilot + ChatGPT Plus | $30 |
| **Premium** | Cursor + Claude Pro + Midjourney Basic | $50 |
| **Pro** | Cursor + Claude Pro + Midjourney Standard + ElevenLabs | $80 |

#### Small Team (5 people)

| Need | Tools | Monthly Cost |
|------|-------|-------------|
| **Code** | GitHub Copilot Business (5 users) | $190 |
| **Text** | Claude/GPT API (moderate usage) | $100-300 |
| **Media** | Midjourney Pro + ElevenLabs Pro + Runway | $150 |
| **Total** | | **$440-$640** |

### 4.2 Recommendations by Profile

#### Student / Learner
- **Code:** GitHub Copilot (free for students) + ChatGPT
- **Text:** Free ChatGPT / Free Claude
- **Media:** Stable Diffusion (local) + Free versions
- **Cost:** $0-10/month

#### Freelance / Creator
- **Code:** Cursor Pro ($20)
- **Text:** Claude Pro ($20) or ChatGPT Plus
- **Media:** Midjourney Basic ($10) + ElevenLabs Starter
- **Cost:** $50-60/month

#### Startup / SMB
- **Code:** GitHub Copilot Business or Cursor teams
- **Text:** GPT/Claude API (pay-as-you-go)
- **Media:** Midjourney Pro + Runway + APIs
- **Cost:** $200-1000/month depending on volume

### 4.3 Main Selection Criteria

| Criteria | Code | Text | Media |
|---------|------|------|-------|
| **Performance** | Claude 3.5 Sonnet | Claude 3.5 / GPT-4 | Midjourney / DALL-E 3 |
| **Cost** | Codeium / Copilot | Claude Haiku / GPT-3.5 | SDXL local / Pika |
| **Privacy** | Codeium / Local models | Llama 3 local | SDXL local |
| **Ease** | Copilot / Cursor | ChatGPT / Claude | Midjourney / Leonardo |
| **Integration** | Copilot (GitHub) | OpenAI/Anthropic API | Adobe Firefly |

---

## 📚 5. Resources and Reference Benchmarks

### 5.1 Academic Benchmarks

#### For Code
- **HumanEval** - https://github.com/openai/human-eval
- **MBPP** - https://github.com/google-research/google-research/tree/master/mbpp
- **MultiPL-E** - https://github.com/nuprl/MultiPL-E

#### For Text
- **MMLU** - https://github.com/hendrycks/test
- **GPQA** - https://github.com/idavidrein/gpqa
- **Big-Bench** - https://github.com/google/BIG-bench
- **TruthfulQA** - https://github.com/sylinrl/TruthfulQA

### 5.2 Comparison Platforms

- **Artificial Analysis** - https://artificialanalysis.ai/
- **LMSys Chatbot Arena** - https://chat.lmsys.org/
- **Papers With Code** - https://paperswithcode.com/
- **Hugging Face Spaces** - https://huggingface.co/spaces

---

## �� Update Notes

**Last Update:** 2025-01-22

**Next Review:** Every 2-3 months

**Contributors:** AI Agent (GitHub Copilot)

---

**Note:** The generative AI field evolves extremely rapidly. Verify pricing and availability information at time of use.
