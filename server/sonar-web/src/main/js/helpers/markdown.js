/*
 * SonarQube
 * Copyright (C) 2009-2018 SonarSource SA
 * mailto:info AT sonarsource DOT com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */

// keep this file in JavaScript, because it is used by a webpack loader
module.exports = { getFrontMatter, separateFrontMatter };

function getFrontMatter(content) {
  const lines = content.split('\n');
  const position = getFrontMatterPosition(lines);
  return position ? parseFrontMatter(lines.slice(position.firstLine + 1, position.lastLine)) : {};
}

function separateFrontMatter(content) {
  const lines = content.split('\n');
  const position = getFrontMatterPosition(lines);
  if (position) {
    const frontmatter = parseFrontMatter(lines.slice(position.firstLine + 1, position.lastLine));
    const content = lines.slice(position.lastLine + 1).join('\n');
    return { frontmatter, content };
  } else {
    return { frontmatter: {}, content };
  }
}

function getFrontMatterPosition(lines) {
  let firstLine;
  let lastLine;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === '---') {
      if (firstLine === undefined) {
        firstLine = i;
      } else {
        lastLine = i;
        break;
      }
    }
  }
  return lastLine !== undefined ? { firstLine, lastLine } : undefined;
}

function parseFrontMatter(lines) {
  const data = {};
  for (let i = 0; i < lines.length; i++) {
    const tokens = lines[i].split(':').map(x => x.trim());
    if (tokens.length === 2) {
      data[tokens[0]] = tokens[1];
    }
  }
  return data;
}
