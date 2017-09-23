import React from 'react';

import sanitizeHtml from 'sanitize-html';

import { isPresent } from './String';

export function cleanSpecial(str) {
  let newStr = str.replace(/Â/g, "");
  newStr = newStr.replace(/&quot;/g, "");
  // assuming these specific chinese characters are never actually intentional...
  newStr = newStr.replace(/猴/g, "f");
  newStr = newStr.replace(/睌/g, "f");
  newStr = newStr.replace(/猼/g, "f");
  newStr = newStr.replace(/✴/g, "fi");
  newStr = newStr.replace(/⢄/g, "ft");
  newStr = newStr.replace(/Ã¶/g, "ö");
  newStr = newStr.replace(/Ã©/g, "é");
  newStr = newStr.replace(/送/g, "fi");
  newStr = newStr.replace(/畔/g, "f");
  newStr = newStr.replace(/㱀/g, "f");
  newStr = newStr.replace(/Ã¼/g, "ü");
  return newStr;
}

export function cleanString(str) {
  let newStr = cleanSpecial(str);
  newStr = sanitizeHtml(newStr, {
    allowedTags: [ 'b', 'i', 'em', 'strong', 'u' ]
  });
  return newStr;
}

export function formatQuestionString(str, query=null) {
  let newStr = cleanString(str);
  if (query) {
    newStr = newStr.replace(new RegExp(query, 'gi'), `<mark class='question-highlight'>$&</mark>`);
  }
  newStr = <span dangerouslySetInnerHTML={{__html: newStr}}/>;
  return newStr;
}

export function extractTossupText(tossup) {
  return cleanSpecial(tossup.text) + " \n\n" + cleanSpecial(tossup.answer) + "\n\n";
}

export function extractBonusText(bonus) {
  let content = cleanSpecial(bonus.leadin) + " \n\n";
  [0, 1, 2].forEach(index => {
    content += " \n\n";
    content += cleanSpecial(bonus.texts[index]);
    content += " \n\n";
    content += cleanSpecial(bonus.answers[index]);
    content += " \n\n";
  });
  return content;
}

export function extractActualAnswer(answer) {
  const regMatch = answer.match(/<b>.*<\/b>/) || answer.match(/<strong>.*<\/strong>/);
  return regMatch ? regMatch[0] : null;
}

export function generateWikiLink(question, index = null) {
  const wikiPrefix = 'https://en.wikipedia.org/w/index.php?search=';
  let url, answer, formattedAnswer;
  if (question.type === "tossup") {
    url = question.wikipedia_url;
    answer = question.answer;
    formattedAnswer = question.formatted_answer;
  } else {
    url = question.wikipedia_urls[index];
    answer = question.answers[index];
    formattedAnswer = question.formatted_answers[index];
  }

  if (isPresent(url)) {
    return url;
  } else if (extractActualAnswer(formattedAnswer)) {
    const actualAnswer = sanitizeHtml(extractActualAnswer(formattedAnswer), { allowedTags: [] });
    return `${wikiPrefix}${encodeURI(actualAnswer)}`;
  } else {
    return `${wikiPrefix}${encodeURI(answer)}`;
  }
}
