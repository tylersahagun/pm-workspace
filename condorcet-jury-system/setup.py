#!/usr/bin/env python3
"""
Condorcet Jury System - Setup Script

Generates initial persona pool from archetypes.
"""

from setuptools import setup, find_packages

setup(
    name="condorcet-jury-system",
    version="1.0.0",
    description="Synthetic user validation for product decisions using LLM-powered personas",
    author="Tyler Sahagun",
    author_email="tyler@askelephant.ai",
    url="https://github.com/YOUR_USERNAME/condorcet-jury-system",
    packages=find_packages(),
    python_requires=">=3.9",
    install_requires=[
        "python-dotenv>=1.0.0",
        "tqdm>=4.65.0",
    ],
    extras_require={
        "api": [
            "anthropic>=0.18.0",
            "openai>=1.0.0",
        ],
    },
    entry_points={
        "console_scripts": [
            "jury-eval=scripts.simulate_jury:main",
        ],
    },
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
    ],
)

