@echo off
title ReWear - Luxury Occasion & Wedding Wear Rentals
cd /d "%~dp0"
echo Starting ReWear Luxury Boutique Server...
echo Website available at: http://localhost:3000
npm.cmd start -- -H 0.0.0.0 -p 3000
pause
