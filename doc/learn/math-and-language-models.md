---
authorGithub: ChristianMurphy
author: Christian Murphy
description: Evaluating if markdown from large language models is valid
group: recipe
index: 8
modified: 2024-11-06
published: 2024-11-06
tags:
  - remark
  - use
  - introduction
title: Generating valid markdown with LLMs
---

# Generating Valid Markdown with Large Language Models: A Guide to Model Evaluations

Large language models (LLMs) are increasingly popular for generating Markdown across technical documentation, structured content, and prototyping. However, all LLMs have the potential to hallucinate or produce incorrect Markdown, especially when different standards are present in their training data. Markdown standards like CommonMark and GitHub-Flavored Markdown (GFM) are necessary for ensuring that content displays consistently across tools and platforms, from documentation generators to code repositories. When an LLM’s output deviates from these standards, content can appear incorrectly formatted, fail to render as expected, or disrupt workflows that rely on Markdown’s consistency.

To achieve reliable, standard-compliant Markdown output, it’s important to guide your LLM toward producing content that aligns with GFM, the widely supported standard.

Model evaluations offer a structured way to address inconsistencies. Rather than adjusting Markdown standards to accommodate imperfect outputs, model evaluations help you assess and refine a model’s behavior to meet established standards.

## Process Overview

To help your LLM reliably generate valid Markdown, this article outlines an evaluation-based process focused on quality assurance. Key steps include:

- **Define Markdown syntax requirements** to set clear boundaries for valid output, including math and directive syntax.
- **Build test cases** covering both valid and invalid Markdown. This allows you to identify common issues and evaluate output thoroughly.
- **Develop a validity metric** to measure output quality and catch errors consistently.
- **Refine the prompt and metric iteratively** to improve output accuracy over time, making Markdown generation more stable and predictable.

By following this structured approach, you’ll ensure your model produces Markdown that meets established standards, maintains compatibility with your tools, and avoids the need for workarounds. This method is especially effective when working with specialized syntax like math and directives, where accuracy is paramount.

## Example

To see this process in action, consider an example involving math syntax in Markdown, a common area where generation can be challenging. Using DeepEval as the framework, this walkthrough will demonstrate a systematic approach to evaluating and ensuring that the model produces valid Markdown, accurately rendering complex math expressions. The overall process shows how careful evaluation can make a significant difference in Markdown reliability.

While this guide focuses on DeepEval, other frameworks are available for evaluating language models. For those following along, refer to this [setup guide for DeepEval](https://docs.confident-ai.com/docs/getting-started).

### Defining Syntax Rules for Mathematical Expressions

In Markdown, mathematical notation typically utilizes LaTeX syntax within `$...$` for inline math or `$$...$$` for block math. For example, `$x + y = z$` represents an inline expression, while `$$ x + y = z $$` denotes a block expression. Adhering to these delimiters is essential for generating valid Markdown.

Key syntax rules for mathematical expressions in Markdown include:

1. **Delimiter Consistency**: Use `$...$` for inline math and `$$...$$` for block math. Ensure each expression employs the appropriate delimiter.
2. **Delimiter Matching**: Each opening `$` or `$$` must have a corresponding closing delimiter. For instance, `$$ x + y = z $$` is valid, whereas `$$ x + y = z $` is not.
3. **Supported LaTeX Commands**: Utilize standard LaTeX commands. For example, `\frac{a}{b}` is valid, but `\unknowncmd{a}{b}` is not.
4. **Subscript and Superscript Syntax**: Enclose multi-character subscripts or superscripts in braces (e.g., `x_{ab}`); single characters do not require braces.
5. **Math Labeling**: Explicitly label code blocks containing math content with a `math` tag to assist Markdown parsers in correctly rendering LaTeX expressions.

For more detailed information, refer to the [remark-math documentation](https://github.com/remarkjs/remark-math/blob/main/readme.md) and the [LaTeX project documentation](https://www.latex-project.org/help/documentation/). 

### Building Test Cases for Math Validation

To create a robust test framework that ensures your LLM-generated Markdown aligns with defined syntax requirements, you can use DeepEval to implement targeted evaluation tests. DeepEval supports customizable evaluation steps that enable you to analyze specific syntax and formatting rules, making it easier to validate Markdown output.

Begin by defining and running custom evaluation tests in DeepEval to check compliance with Markdown syntax standards, especially focusing on the model’s ability to produce correct inline and block structures. For more detailed guidance on setting up tests and defining metrics, consult the [DeepEval evaluation documentation](https://docs.confident-ai.com/docs/evaluation-introduction).

Start testing by using a predefined set of valid and invalid Markdown examples to verify that your evaluation setup accurately measures syntax compliance. Below is a sample set of test cases covering valid and invalid Markdown math expressions, designed to evaluate common syntax patterns:

<details>

<summary>Sample Test Suite</summary>

```python
from deepeval.test_case import LLMTestCase

# Valid Test Cases
valid_test_cases = [
    # Basic Inline Math
    LLMTestCase(name="Valid Simple Inline Math", actual_output="$x + y = z$", input=""),
    LLMTestCase(
        name="Valid Complex Inline Math with Fractions",
        actual_output="$x = \\frac{a + b}{c + d}$",
        input="",
    ),
    LLMTestCase(
        name="Valid Inline Math with Greek Symbols",
        actual_output="$\\alpha + \\beta = \\gamma$",
        input="",
    ),
    LLMTestCase(
        name="Valid Inline Math with Exponents and Variables",
        actual_output="$a^2 + b^2 = c^2$",
        input="",
    ),
    LLMTestCase(
        name="Valid Inline Math with Trigonometric Function",
        actual_output="$\\sin(x) + \\cos(y) = 1$",
        input="",
    ),
    LLMTestCase(
        name="Valid Inline Math with Complex Subscript and Superscript",
        actual_output="$x_{i}^{j} + y_{i}^{j} = z$",
        input="",
    ),
    # Basic Block Math
    LLMTestCase(
        name="Valid Simple Block Math", actual_output="$$x + y = z$$", input=""
    ),
    LLMTestCase(
        name="Valid Complex Block Math with Nested Fractions",
        actual_output="$$x = \\frac{\\frac{a}{b}}{\\frac{c}{d}}$$",
        input="",
    ),
    LLMTestCase(
        name="Valid Block Math with Summation and Integral",
        actual_output="$$\\sum_{i=1}^n i = \\frac{n(n+1)}{2}$$",
        input="",
    ),
    LLMTestCase(
        name="Valid Block Math with Limit Notation",
        actual_output="$$ \\lim_{x \\to \\infty} \\frac{1}{x} = 0 $$",
        input="",
    ),
    LLMTestCase(
        name="Valid Block Math with Product Notation",
        actual_output="$$ \\prod_{i=1}^n i = n! $$",
        input="",
    ),
    # Code Block Math
    LLMTestCase(
        name="Valid Math in Single-Line Code Block",
        actual_output="```math\nx = \\sqrt{a}\n```",
        input="",
    ),
    LLMTestCase(
        name="Valid Math in Multi-Line Code Block",
        actual_output="```math\nx = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}\ny = a^2 + b^2\n```",
        input="",
    ),
    # Plain Text and Non-Math Content
    LLMTestCase(
        name="Valid Complex Plain Text with Special Characters",
        actual_output="This is a sentence with various punctuation, numbers like 10%, and dates like 12/25.",
        input="",
    ),
    # Edge Cases
    LLMTestCase(
        name="Valid Mixed Inline Math with Plain Text",
        actual_output="The result of $E = mc^2$ is energy, where $m$ is mass and $c$ is the speed of light.",
        input="",
    ),
    LLMTestCase(
        name="Valid Complex Nested Math Expression",
        actual_output="$$ x = \\frac{\\sqrt{a + \\frac{b}{c}}}{d} $$",
        input="",
    ),
    LLMTestCase(
        name="Valid Explicit Escaping of Dollar Signs in Text",
        actual_output="The price is \$10 and the expression is $x + y = z$",
        input="",
    ),
    LLMTestCase(
        name="Valid Math in Header Text",
        actual_output="# Equation for Energy $E = mc^2$",
        input="",
    ),
    LLMTestCase(
        name="Valid Math in List",
        actual_output="- Use $E = mc^2$ for energy",
        input="",
    ),
    LLMTestCase(
        name="Valid Inline Math with Matrix Notation",
        actual_output="$\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$",
        input="",
    ),
    LLMTestCase(
        name="Valid Mixed Math and Text with Parentheses",
        actual_output="Given $f(x) = x^2$, the function is parabolic.",
        input="",
    ),
    # Basic Inline Math
    LLMTestCase(
        name="Valid Simple Inline Math with Subtraction",
        actual_output="$a - b = c$",
        input="",
    ),
    LLMTestCase(
        name="Valid Inline Math with Multiple Variables",
        actual_output="$w + x = y + z$",
        input="",
    ),
    # Complex Inline Math with Fractions
    LLMTestCase(
        name="Valid Inline Fraction with Different Variables",
        actual_output="$y = \\frac{p - q}{r + s}$",
        input="",
    ),
    LLMTestCase(
        name="Valid Inline Fraction with Simplified Terms",
        actual_output="$d = \\frac{2a}{3b}$",
        input="",
    ),
    # Inline Math with Greek Symbols
    LLMTestCase(
        name="Valid Inline Math with Greek Letters and Pi",
        actual_output="$\\theta + \\phi = \\pi$",
        input="",
    ),
    LLMTestCase(
        name="Valid Inline Math with Greek Letters and Multiplication",
        actual_output="$\\kappa \\cdot \\mu = \\nu$",
        input="",
    ),
    # Inline Math with Exponents and Variables
    LLMTestCase(
        name="Valid Inline Math with Cubed Terms",
        actual_output="$p^3 + q^3 = r^3$",
        input="",
    ),
    LLMTestCase(
        name="Valid Inline Math with Exponential Variables",
        actual_output="$a^x + b^y = c^z$",
        input="",
    ),
    # Inline Math with Trigonometric Functions
    LLMTestCase(
        name="Valid Inline Math with Tangent Function",
        actual_output="$\\tan(x) = \\frac{\\sin(x)}{\\cos(x)}$",
        input="",
    ),
    LLMTestCase(
        name="Valid Inline Math with Pythagorean Identity",
        actual_output="$\\cos^2(x) + \\sin^2(x) = 1$",
        input="",
    ),
    # Inline Math with Complex Subscript and Superscript
    LLMTestCase(
        name="Valid Inline Math with Nested Subscript and Superscript",
        actual_output="$y_{k+1}^{j+1} = y_{k}^{j} + x_{k}^{j}$",
        input="",
    ),
    LLMTestCase(
        name="Valid Inline Math with Exponential Superscript",
        actual_output="$f_{x}^{y} = \\frac{x^y}{y^x}$",
        input="",
    ),
    # Simple Block Math
    LLMTestCase(
        name="Valid Block Math with Subtraction",
        actual_output="$$p - q = r$$",
        input="",
    ),
    LLMTestCase(
        name="Valid Block Math with Multiplication",
        actual_output="$$u \\times v = w$$",
        input="",
    ),
    # Complex Block Math with Nested Fractions
    LLMTestCase(
        name="Valid Nested Fraction Block Math with Multiple Variables",
        actual_output="$$y = \\frac{\\frac{m + n}{p}}{\\frac{q}{r + s}}$$",
        input="",
    ),
    LLMTestCase(
        name="Valid Nested Fraction Block Math with Simple Terms",
        actual_output="$$d = \\frac{\\frac{e}{f}}{\\frac{g}{h}}$$",
        input="",
    ),
    # Block Math with Summation and Integral
    LLMTestCase(
        name="Valid Block Math with Infinite Summation",
        actual_output="$$\\sum_{n=0}^{\\infty} \\frac{1}{2^n} = 1$$",
        input="",
    ),
    LLMTestCase(
        name="Valid Block Math with Integral Expression",
        actual_output="$$\\int_{-1}^{1} x^2 dx = \\frac{2}{3}$$",
        input="",
    ),
    # Block Math with Limit Notation
    LLMTestCase(
        name="Valid Limit Notation Approaching Zero",
        actual_output="$$ \\lim_{x \\to 0} \\frac{\\sin(x)}{x} = 1 $$",
        input="",
    ),
    LLMTestCase(
        name="Valid Limit Notation Approaching Number",
        actual_output="$$ \\lim_{t \\to 5} \\frac{t^2 - 25}{t - 5} = 10 $$",
        input="",
    ),
]

# Invalid Test Cases
invalid_test_cases = [
    # Missing or Incorrect Delimiters
    LLMTestCase(
        name="Invalid Missing Closing Dollar in Inline Math",
        actual_output="$x + y",
        input="",
    ),
    LLMTestCase(
        name="Invalid Extra Closing Dollar in Inline Math",
        actual_output="$x + y$$.",
        input="",
    ),
    LLMTestCase(
        name="Invalid Mismatched Inline and Block Delimiters",
        actual_output="$$x + y = z$",
        input="",
    ),
    # Incorrect LaTeX Commands
    LLMTestCase(
        name="Invalid LaTeX Command with Typo",
        actual_output="$$ x = \\sqrroot{a} $$",
        input="",
    ),
    LLMTestCase(
        name="Invalid LaTeX Command with Missing Arguments",
        actual_output="$$ x = \\frac{}{} $$",
        input="",
    ),
    LLMTestCase(
        name="Invalid LaTeX Command with Extra Arguments",
        actual_output="$$ x = \\frac{a}{b}{c} $$",
        input="",
    ),
    LLMTestCase(
        name="Invalid LaTeX Environment in Inline Math",
        actual_output="$ \\begin{matrix} a & b \\end{matrix} $",
        input="",
    ),
    # Code Block Issues
    LLMTestCase(
        name="Invalid Math in Unlabeled Code Block",
        actual_output="```\nx = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}\n```",
        input="",
    ),
    LLMTestCase(
        name="Invalid Math in Incorrectly Labeled Code Block",
        actual_output="```python\nx = \\sqrt{y}\n```",
        input="",
    ),
    # Edge Cases with Delimiters
    LLMTestCase(
        name="Invalid Edge Case with Empty Inline Math Delimiters",
        actual_output="$ $",
        input="",
    ),
    LLMTestCase(
        name="Invalid Edge Case with Empty Block Math Delimiters",
        actual_output="$$ $$",
        input="",
    ),
    LLMTestCase(
        name="Invalid Edge Case with Nested Math Delimiters",
        actual_output="$x + $y$ + z$",
        input="",
    ),
    LLMTestCase(
        name="Invalid Nested Dollar Signs in Plain Text",
        actual_output="The amount is $10 for $20 items.",
        input="",
    ),
    LLMTestCase(
        name="Invalid Abruptly Ended Block Math Expression",
        actual_output="$$ x + $$",
        input="",
    ),
    LLMTestCase(
        name="Invalid Unescaped Dollar Sign in Non-Math Context",
        actual_output="The price is $10 and the other variable is $x$.",
        input="",
    ),
    LLMTestCase(
        name="Invalid Missing Opening Dollar in Inline Math",
        actual_output="x + y$",
        input="",
    ),
    LLMTestCase(
        name="Invalid Extra Opening Dollar in Inline Math",
        actual_output="$$x + y = z$",
        input="",
    ),
    LLMTestCase(
        name="Invalid Inline Math with Unsupported LaTeX Command",
        actual_output="$ \\notacommand{x} $",
        input="",
    ),
    LLMTestCase(
        name="Invalid Block Math with Non-Ending Environment",
        actual_output="$$ \\begin{matrix} a & b $$",
        input="",
    ),
    LLMTestCase(
        name="Invalid Mismatched Subscript and Superscript Notation",
        actual_output="$a_i^$",
        input="",
    ),
    LLMTestCase(
        name="Invalid Inline Math with Incorrect Escape Character",
        actual_output="$ x = \\times y $",
        input="",
    ),
    LLMTestCase(
        name="Invalid Code Block with Mixed Languages Label",
        actual_output="```math-python\nx = \\sqrt{y}\n```",
        input="",
    ),
    # Missing Closing Dollar in Inline Math
    LLMTestCase(
        name="Invalid Inline Math Missing Closing Dollar - Simple",
        actual_output="$a + b",
        input="",
    ),
    LLMTestCase(
        name="Invalid Inline Math Missing Closing Dollar - Addition",
        actual_output="$f + g",
        input="",
    ),
    # Extra Closing Dollar in Inline Math
    LLMTestCase(
        name="Invalid Inline Math with Extra Closing Dollar - Subtraction",
        actual_output="$x - y$$",
        input="",
    ),
    LLMTestCase(
        name="Invalid Inline Math with Extra Closing Dollar - Variable Subtraction",
        actual_output="$m - n$$",
        input="",
    ),
    # LaTeX Command with Typo
    LLMTestCase(
        name="Invalid LaTeX Command Typo - Squart Typo",
        actual_output="$$ x = \\squart{a} $$",
        input="",
    ),
    LLMTestCase(
        name="Invalid LaTeX Command Typo - Frc Typo",
        actual_output="$$ z = \\frc{c}{d} $$",
        input="",
    ),
    # LaTeX Command with Missing Arguments
    LLMTestCase(
        name="Invalid LaTeX Command Missing Arguments - Fraction",
        actual_output="$$ y = \\frac{}{} $$",
        input="",
    ),
    LLMTestCase(
        name="Invalid LaTeX Command Missing Arguments - Square Root",
        actual_output="$$ x = \\sqrt{} $$",
        input="",
    ),
    # Math in Incorrectly Labeled Code Block
    LLMTestCase(
        name="Invalid Code Block Labeled Plaintext",
        actual_output="```plaintext\nf = \\cos(\\theta)\n```",
        input="",
    ),
    LLMTestCase(
        name="Invalid Code Block Labeled JavaScript",
        actual_output="```javascript\nx = \\sqrt{y}\n```",
        input="",
    ),
    # Edge Case with Empty Inline Math Delimiters
    LLMTestCase(
        name="Invalid Empty Inline Math Delimiters - One Space",
        actual_output="$ $",
        input="",
    ),
    LLMTestCase(
        name="Invalid Empty Inline Math Delimiters - Multiple Spaces",
        actual_output="$    $",
        input="",
    ),
    # Edge Case with Empty Block Math Delimiters
    LLMTestCase(
        name="Invalid Empty Block Math Delimiters - One Space",
        actual_output="$$  $$",
        input="",
    ),
    LLMTestCase(
        name="Invalid Empty Block Math Delimiters - Multiple Spaces",
        actual_output="$$   $$",
        input="",
    ),
    # Edge Case with Nested Math Delimiters
    LLMTestCase(
        name="Invalid Inline Math with Nested Dollar Signs - Subtraction",
        actual_output="$x - $y$ - z$",
        input="",
    ),
    LLMTestCase(
        name="Invalid Inline Math with Nested Dollar Signs - Addition",
        actual_output="$a + $b$ + c$",
        input="",
    ),
    # Nested Dollar Signs in Plain Text
    LLMTestCase(
        name="Invalid Plain Text with Nested Dollar Signs - Discount",
        actual_output="The cost is $50 and we offer $20 off.",
        input="",
    ),
    LLMTestCase(
        name="Invalid Plain Text with Nested Dollar Signs - Fee",
        actual_output="The rate is $10, with a $5 fee.",
        input="",
    ),
    # Abruptly Ended Block Math Expression
    LLMTestCase(
        name="Invalid Block Math Abrupt Ending - Simple Subtraction",
        actual_output="$$ x - $$",
        input="",
    ),
    LLMTestCase(
        name="Invalid Block Math Abrupt Ending - Simple Addition",
        actual_output="$$ a + $$",
        input="",
    ),
    # Invalid Escaped Parentheses for Inline Math
    LLMTestCase(
        name="Invalid Escaped Parentheses Inline Math",
        actual_output=r"\(x + y = z\)",
        input="",
    ),
    # Invalid Escaped Brackets for Block Math
    LLMTestCase(
        name="Invalid Escaped Brackets Block Math",
        actual_output=r"\[\int_{a}^{b} f(x)\,dx\]",
        input="",
    ),
    # Invalid Environment Wrapper using `equation`
    LLMTestCase(
        name="Invalid LaTeX Equation Environment Wrapper",
        actual_output=r"\begin{equation} x^2 + y^2 = z^2 \end{equation}",
        input="",
    ),
    # Invalid Environment Wrapper using `align`
    LLMTestCase(
        name="Invalid LaTeX Align Environment Wrapper",
        actual_output=r"\begin{align} a &= b + c \\ d &= e + f \end{align}",
        input="",
    ),
    # Invalid Environment Wrapper using `gather`
    LLMTestCase(
        name="Invalid LaTeX Gather Environment Wrapper",
        actual_output=r"\begin{gather} a = b + c \\ x = y + z \end{gather}",
        input="",
    ),
    # Mixed Invalid Escaped Parentheses and Escaped Brackets
    LLMTestCase(
        name="Invalid Mixed Escaped Parentheses and Brackets",
        actual_output=r"\( a^2 + b^2 = c^2 \) \[ x^2 + y^2 = z^2 \]",
        input="",
    ),
]
```

</details>

## Developing a Validity Metric

After building test cases for valid and invalid Markdown, the next step is to define a validity metric that objectively measures the quality of your model’s output. A validity metric provides a systematic way to evaluate Markdown syntax and ensure that generated content adheres to the expected standards, particularly in areas that can be prone to error, like mathematical expressions.

Using DeepEval, you can create a custom validity metric that applies specific evaluation criteria to identify compliance with Markdown syntax rules. This metric will assess key elements, such as the proper use of delimiters, the validity of LaTeX commands, and the correct application of subscripts and superscripts.

The following example demonstrates how to set up a validity metric for Markdown math and LaTeX syntax using DeepEval's `GEval` class. This metric includes multiple evaluation steps that cover common Markdown requirements, such as checking for correct delimiters and validating LaTeX commands.

<details>
<summary>Sample Validity Metric</summary>

```python
from deepeval.metrics import GEval
from deepeval.test_case import LLMTestCaseParams

math_syntax_metric = GEval(
    name="Markdown Math and LaTeX Syntax Validation",
    evaluation_params=[LLMTestCaseParams.ACTUAL_OUTPUT],
    evaluation_steps=[
        "Evaluate content as math only if it includes math symbols (e.g., `+`, `-`, `=`, `/`), LaTeX commands (e.g., `\\frac`), or subscript formatting (e.g., `x_{ab}`). Pass if it contains only non-math dollar signs (e.g., `$10 for $20`).",
        "Inline math must use `$...$`, and block math must use `$$...$$`, with each expression using one type consistently. Fail if delimiters are mismatched (e.g., `$$x + y = z$`).",
        "Each `$` or `$$` must have a closing match or be inherently complete (e.g., fractions). Fail if any delimiters are unmatched.",
        "Allow only standard LaTeX commands (e.g., `\\frac`, `\\sqrt`) with paired braces (e.g., `\\frac{a}{b}`). Fail if commands are unrecognized or misformatted. Math in code blocks must be labeled `math`; fail if math appears in unlabeled blocks.",
        "Multi-character subscripts/superscripts require braces (e.g., `x_{ab}`); single characters do not. Fail if braces are incorrect.",
        "Simple inline math (e.g., `$x + y = z$`) may pass without `math` labels if it contains only basic operators (`+`, `-`, `=`, `/`) and no LaTeX commands.",
    ],
    threshold=0.8,
)
```

</details>

### Refine the prompt and metric iteratively

This metric evaluates multiple syntax elements, assigning a pass or fail based on specific criteria, with a threshold of 0.8 to determine acceptable quality. Using this metric as part of your testing suite helps ensure that your model consistently generates valid Markdown, reducing errors and maintaining high content quality.

To achieve reliable Markdown generation, refining both the system prompt and evaluation metric is essential. These two aspects work together: a well-crafted prompt steers the model toward producing compliant output, while a robust metric objectively evaluates the results. Iteratively improving both allows you to address any recurring issues in Markdown generation and progressively enhance output quality.

The next two sections cover strategies for refining each component:

1. **Refining the System Prompt**: This section explains how to adjust the system prompt to give the model clearer, more effective instructions on Markdown syntax and formatting.
   
2. **Refining the Metrics**: Here, you'll learn how to adapt the evaluation metric to better capture the nuances of Markdown syntax and ensure accurate performance measurement.

#### Refining the System Prompt

To guide the model in generating correct Markdown syntax, refining the system prompt is a key step. By providing precise instructions tailored to Markdown requirements—such as using valid LaTeX syntax for math expressions—the prompt sets clear expectations for the model’s output. This refinement process involves analyzing test results and updating the prompt to handle any observed syntax issues.

The following example demonstrates how to define a system prompt in LiteLLM that directs the model to follow Markdown standards for mathematical expressions.

```python
from litellm import completion  # Example placeholder; replace with your real model library
from deepeval.test_case import LLMTestCase
from deepeval.dataset import EvaluationDataset
from deepeval import assert_test
import pytest

# Define the system prompt (Note: This is an example placeholder; replace it with a prompt tailored to your project)
system_prompt = {
    "role": "system",
    "content": (
        "Generate Markdown output that uses valid LaTeX for math expressions. "
        "For inline math, use single dollar signs ($...$), and for block math, use double dollar signs ($$...$$). "
        "Ensure that all LaTeX commands are standard and correctly formatted."
    ),
}

# Function to generate a response from the model (Note: LiteLLM and this function are placeholders; replace with your actual model and response handling code)
def get_response(user_prompt: str) -> str:
    """Return the LiteLLM response.

    Args:
        user_prompt (str): The user's input prompt for the chatbot.

    Raises:
        TypeError: If the response is not a string.

    Returns:
        str: The response content from the model.
    """
    messages = [
        system_prompt,
        {
            "role": "user",
            "content": user_prompt,
        },
    ]

    response = completion(
        model="ollama_chat/llama3.1",
        messages=messages,
    )

    message = response.choices[0].message.content

    error_message = "No response from model"
    if not isinstance(message, str):
        raise TypeError(error_message)
    return message

# Define a template with math-related test cases (Note: These are example placeholders; replace with relevant cases for your project)
test_case_template = [
    TestCaseData(
        name="Generate_Quadratic_Formula",
        user_prompt="Generate the quadratic formula in LaTeX format.",
    ),
    TestCaseData(
        name="Generate_Pythagorean_Theorem",
        user_prompt="Provide the Pythagorean theorem formatted in LaTeX.",
    ),
    TestCaseData(
        name="Generate_Power_Rule_Example",
        user_prompt="Show the power rule for differentiation in LaTeX, using an example with x^5.",
    ),
]

# Generate test cases using the system prompt and defined responses
test_cases = [
    LLMTestCase(
        name=data.name,
        input=data.user_prompt,
        actual_output=get_response(data.user_prompt)
    )
    for data in test_case_template
]

# Create the dataset with the generated test cases
dataset = EvaluationDataset(test_cases=test_cases)

# Test function to evaluate model outputs against math syntax metric
@pytest.mark.parametrize("test_case", dataset)
def test_model_outputs(test_case: LLMTestCase) -> None:
    """Test the model's output against expected Markdown formatting.

    This function verifies that the model-generated Markdown adheres to math
    syntax standards using the math_syntax_metric.
    """
    assert_test(
        test_case,
        [
            math_syntax_metric,
        ],
    )

```

In this setup, the `system_prompt` instructs the model on specific Markdown and LaTeX requirements, helping it produce output that meets your evaluation criteria. Reviewing the model’s responses and iterating on the prompt based on errors observed in test cases can improve its reliability over time.

#### Refining the Metrics

While the system prompt helps shape the model’s output, refining the evaluation metric ensures that your test cases capture any syntax deviations accurately. As you review test outcomes, you may find patterns in the model’s output that reveal opportunities to update the metric. For instance, if certain expressions pass the tests but don’t fully align with Markdown standards, adding specific conditions to the metric can enhance its precision.

Below is an example of refining your metric with a test suite that evaluates both valid and invalid cases. By running this code, you verify that your evaluation metric (`math_syntax_metric`) distinguishes between correct and incorrect Markdown expressions, effectively catching errors.

```python
from deepeval import assert_test
from deepeval.dataset import EvaluationDataset
from deepeval.test_case import LLMTestCase
import pytest

### Include test cases and metric above here

# Create datasets
valid_dataset = EvaluationDataset(test_cases=valid_test_cases)
invalid_dataset = EvaluationDataset(test_cases=invalid_test_cases)

# Test function for valid cases, expecting no exceptions
@pytest.mark.parametrize("test_case", valid_dataset)
def test_valid_cases(test_case: LLMTestCase) -> None:
    assert_test(
        test_case,
        [
            math_syntax_metric,
        ],
    )

# Test function for invalid cases, expecting exceptions
@pytest.mark.parametrize("test_case", invalid_dataset)
def test_invalid_cases(test_case: LLMTestCase) -> None:
    with pytest.raises(AssertionError):
        assert_test(
            test_case,
            [
                math_syntax_metric,
            ],
        )
```

In this example, the `test_valid_cases` function ensures that valid cases pass without triggering exceptions, while the `test_invalid_cases` function confirms that invalid cases raise assertion errors as expected. Reviewing results from these tests allows you to iteratively update both the system prompt and the evaluation metric, ensuring your model consistently produces Markdown that meets syntax standards. 

Together, these refinements in prompt and metric provide a reliable evaluation framework that reduces errors and ensures high-quality Markdown output.

## Conclusion and Next Steps

Generating valid Markdown with large language models requires a methodical approach, combining clear standards, targeted test cases, and iterative refinements. By defining syntax requirements, building robust test cases, establishing validity metrics, and refining both prompts and evaluation criteria, you create a framework that encourages consistent and accurate Markdown output. This structured process allows your model to produce content that meets established standards, reducing errors, maintaining compatibility, and supporting workflows that rely on Markdown’s predictability.

As you move forward, consider expanding the evaluation framework to cover additional Markdown elements or specialized syntax based on your project’s needs. Testing and refining with real-world data can further enhance the model's adaptability and resilience across various use cases. For those ready to dive deeper, experimenting with other model evaluation tools or refining custom metrics may open up even more precision in output quality.

By dedicating time to consistent model evaluation, you’re setting up your projects for success, delivering Markdown that works seamlessly across platforms and meets the high standards that developers and users expect.
