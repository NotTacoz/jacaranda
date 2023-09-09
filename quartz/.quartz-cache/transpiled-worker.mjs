var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// quartz/worker.ts
import sourceMapSupport from "source-map-support";

// quartz/plugins/transformers/frontmatter.ts
import matter from "gray-matter";
import remarkFrontmatter from "remark-frontmatter";
import yaml from "js-yaml";
import toml from "toml";

// quartz/util/path.ts
import { slug } from "github-slugger";
var QUARTZ = "quartz";
function slugifyFilePath(fp, excludeExt) {
  fp = _stripSlashes(fp);
  let ext = _getFileExtension(fp);
  const withoutFileExt = fp.replace(new RegExp(ext + "$"), "");
  if (excludeExt || [".md", ".html", void 0].includes(ext)) {
    ext = "";
  }
  let slug2 = withoutFileExt.split("/").map((segment) => segment.replace(/\s/g, "-").replace(/%/g, "-percent")).join("/").replace(/\/$/, "");
  if (_endsWith(slug2, "_index")) {
    slug2 = slug2.replace(/_index$/, "index");
  }
  return slug2 + ext;
}
__name(slugifyFilePath, "slugifyFilePath");
function simplifySlug(fp) {
  return _stripSlashes(_trimSuffix(fp, "index"), true);
}
__name(simplifySlug, "simplifySlug");
function transformInternalLink(link) {
  let [fplike, anchor] = splitAnchor(decodeURI(link));
  const folderPath = _isFolderPath(fplike);
  let segments = fplike.split("/").filter((x) => x.length > 0);
  let prefix = segments.filter(_isRelativeSegment).join("/");
  let fp = segments.filter((seg) => !_isRelativeSegment(seg) && seg !== "").join("/");
  const simpleSlug = simplifySlug(slugifyFilePath(fp));
  const joined = joinSegments(_stripSlashes(prefix), _stripSlashes(simpleSlug));
  const trail = folderPath ? "/" : "";
  const res = _addRelativeToStart(joined) + trail + anchor;
  return res;
}
__name(transformInternalLink, "transformInternalLink");
function pathToRoot(slug2) {
  let rootPath = slug2.split("/").filter((x) => x !== "").slice(0, -1).map((_) => "..").join("/");
  if (rootPath.length === 0) {
    rootPath = ".";
  }
  return rootPath;
}
__name(pathToRoot, "pathToRoot");
function resolveRelative(current, target) {
  const res = joinSegments(pathToRoot(current), simplifySlug(target));
  return res;
}
__name(resolveRelative, "resolveRelative");
function splitAnchor(link) {
  let [fp, anchor] = link.split("#", 2);
  anchor = anchor === void 0 ? "" : "#" + slugAnchor(anchor);
  return [fp, anchor];
}
__name(splitAnchor, "splitAnchor");
function slugAnchor(anchor) {
  return slug(anchor);
}
__name(slugAnchor, "slugAnchor");
function slugTag(tag) {
  return tag.split("/").map((tagSegment) => slug(tagSegment)).join("/");
}
__name(slugTag, "slugTag");
function joinSegments(...args) {
  return args.filter((segment) => segment !== "").join("/");
}
__name(joinSegments, "joinSegments");
function getAllSegmentPrefixes(tags) {
  const segments = tags.split("/");
  const results = [];
  for (let i = 0; i < segments.length; i++) {
    results.push(segments.slice(0, i + 1).join("/"));
  }
  return results;
}
__name(getAllSegmentPrefixes, "getAllSegmentPrefixes");
function transformLink(src, target, opts) {
  let targetSlug = transformInternalLink(target);
  if (opts.strategy === "relative") {
    return targetSlug;
  } else {
    const folderTail = _isFolderPath(targetSlug) ? "/" : "";
    const canonicalSlug = _stripSlashes(targetSlug.slice(".".length));
    let [targetCanonical, targetAnchor] = splitAnchor(canonicalSlug);
    if (opts.strategy === "shortest") {
      const matchingFileNames = opts.allSlugs.filter((slug2) => {
        const parts = slug2.split("/");
        const fileName = parts.at(-1);
        return targetCanonical === fileName;
      });
      if (matchingFileNames.length === 1) {
        const targetSlug2 = matchingFileNames[0];
        return resolveRelative(src, targetSlug2) + targetAnchor;
      }
    }
    return joinSegments(pathToRoot(src), canonicalSlug) + folderTail;
  }
}
__name(transformLink, "transformLink");
function _isFolderPath(fplike) {
  return fplike.endsWith("/") || _endsWith(fplike, "index") || _endsWith(fplike, "index.md") || _endsWith(fplike, "index.html");
}
__name(_isFolderPath, "_isFolderPath");
function _endsWith(s, suffix) {
  return s === suffix || s.endsWith("/" + suffix);
}
__name(_endsWith, "_endsWith");
function _trimSuffix(s, suffix) {
  if (_endsWith(s, suffix)) {
    s = s.slice(0, -suffix.length);
  }
  return s;
}
__name(_trimSuffix, "_trimSuffix");
function _getFileExtension(s) {
  return s.match(/\.[A-Za-z0-9]+$/)?.[0];
}
__name(_getFileExtension, "_getFileExtension");
function _isRelativeSegment(s) {
  return /^\.{0,2}$/.test(s);
}
__name(_isRelativeSegment, "_isRelativeSegment");
function _stripSlashes(s, onlyStripPrefix) {
  if (s.startsWith("/")) {
    s = s.substring(1);
  }
  if (!onlyStripPrefix && s.endsWith("/")) {
    s = s.slice(0, -1);
  }
  return s;
}
__name(_stripSlashes, "_stripSlashes");
function _addRelativeToStart(s) {
  if (s === "") {
    s = ".";
  }
  if (!s.startsWith(".")) {
    s = joinSegments(".", s);
  }
  return s;
}
__name(_addRelativeToStart, "_addRelativeToStart");

// quartz/plugins/transformers/frontmatter.ts
var defaultOptions = {
  delims: "---",
  language: "yaml"
};
var FrontMatter = /* @__PURE__ */ __name((userOpts) => {
  const opts = { ...defaultOptions, ...userOpts };
  return {
    name: "FrontMatter",
    markdownPlugins() {
      return [
        [remarkFrontmatter, ["yaml", "toml"]],
        () => {
          return (_, file) => {
            const { data } = matter(file.value, {
              ...opts,
              engines: {
                yaml: (s) => yaml.load(s, { schema: yaml.JSON_SCHEMA }),
                toml: (s) => toml.parse(s)
              }
            });
            if (data.tag) {
              data.tags = data.tag;
            }
            if (data.tags && !Array.isArray(data.tags)) {
              data.tags = data.tags.toString().split(",").map((tag) => tag.trim());
            }
            data.tags = [...new Set(data.tags?.map((tag) => slugTag(tag)))];
            file.data.frontmatter = {
              title: file.stem ?? "Untitled",
              tags: [],
              ...data
            };
          };
        }
      ];
    }
  };
}, "FrontMatter");

// quartz/plugins/transformers/gfm.ts
import remarkGfm from "remark-gfm";
import smartypants from "remark-smartypants";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
var defaultOptions2 = {
  enableSmartyPants: true,
  linkHeadings: true
};
var GitHubFlavoredMarkdown = /* @__PURE__ */ __name((userOpts) => {
  const opts = { ...defaultOptions2, ...userOpts };
  return {
    name: "GitHubFlavoredMarkdown",
    markdownPlugins() {
      return opts.enableSmartyPants ? [remarkGfm, smartypants] : [remarkGfm];
    },
    htmlPlugins() {
      if (opts.linkHeadings) {
        return [
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            {
              behavior: "append",
              content: {
                type: "text",
                value: " \xA7"
              }
            }
          ]
        ];
      } else {
        return [];
      }
    }
  };
}, "GitHubFlavoredMarkdown");

// quartz/plugins/transformers/lastmod.ts
import fs from "fs";
import path from "path";
import { Repository } from "@napi-rs/simple-git";
var defaultOptions3 = {
  priority: ["frontmatter", "git", "filesystem"]
};
var CreatedModifiedDate = /* @__PURE__ */ __name((userOpts) => {
  const opts = { ...defaultOptions3, ...userOpts };
  return {
    name: "CreatedModifiedDate",
    markdownPlugins() {
      return [
        () => {
          let repo = void 0;
          return async (_tree, file) => {
            let created = void 0;
            let modified = void 0;
            let published = void 0;
            const fp = path.posix.join(file.cwd, file.data.filePath);
            for (const source of opts.priority) {
              if (source === "filesystem") {
                const st = await fs.promises.stat(fp);
                created ||= st.birthtimeMs;
                modified ||= st.mtimeMs;
              } else if (source === "frontmatter" && file.data.frontmatter) {
                created ||= file.data.frontmatter.date;
                modified ||= file.data.frontmatter.lastmod;
                modified ||= file.data.frontmatter.updated;
                modified ||= file.data.frontmatter["last-modified"];
                published ||= file.data.frontmatter.publishDate;
              } else if (source === "git") {
                if (!repo) {
                  repo = new Repository(file.cwd);
                }
                modified ||= await repo.getFileLatestModifiedDateAsync(file.data.filePath);
              }
            }
            file.data.dates = {
              created: created ? new Date(created) : /* @__PURE__ */ new Date(),
              modified: modified ? new Date(modified) : /* @__PURE__ */ new Date(),
              published: published ? new Date(published) : /* @__PURE__ */ new Date()
            };
          };
        }
      ];
    }
  };
}, "CreatedModifiedDate");

// quartz/plugins/transformers/latex.ts
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeMathjax from "rehype-mathjax/svg.js";
var Latex = /* @__PURE__ */ __name((opts) => {
  const engine = opts?.renderEngine ?? "katex";
  return {
    name: "Latex",
    markdownPlugins() {
      return [remarkMath];
    },
    htmlPlugins() {
      if (engine === "katex") {
        return [[rehypeKatex, { output: "html" }]];
      } else {
        return [rehypeMathjax];
      }
    },
    externalResources() {
      if (engine === "katex") {
        return {
          css: [
            // base css
            "https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css"
          ],
          js: [
            {
              // fix copy behaviour: https://github.com/KaTeX/KaTeX/blob/main/contrib/copy-tex/README.md
              src: "https://cdn.jsdelivr.net/npm/katex@0.16.7/dist/contrib/copy-tex.min.js",
              loadTime: "afterDOMReady",
              contentType: "external"
            }
          ]
        };
      } else {
        return {};
      }
    }
  };
}, "Latex");

// quartz/plugins/transformers/description.ts
import { toString } from "hast-util-to-string";
var defaultOptions4 = {
  descriptionLength: 150
};
var escapeHTML = /* @__PURE__ */ __name((unsafe) => {
  return unsafe.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}, "escapeHTML");
var Description = /* @__PURE__ */ __name((userOpts) => {
  const opts = { ...defaultOptions4, ...userOpts };
  return {
    name: "Description",
    htmlPlugins() {
      return [
        () => {
          return async (tree, file) => {
            const frontMatterDescription = file.data.frontmatter?.description;
            const text = escapeHTML(toString(tree));
            const desc = frontMatterDescription ?? text;
            const sentences = desc.replace(/\s+/g, " ").split(".");
            let finalDesc = "";
            let sentenceIdx = 0;
            const len = opts.descriptionLength;
            while (finalDesc.length < len) {
              const sentence = sentences[sentenceIdx];
              if (!sentence)
                break;
              finalDesc += sentence + ".";
              sentenceIdx++;
            }
            file.data.description = finalDesc;
            file.data.text = text;
          };
        }
      ];
    }
  };
}, "Description");

// quartz/plugins/transformers/links.ts
import path2 from "path";
import { visit } from "unist-util-visit";
import isAbsoluteUrl from "is-absolute-url";
var defaultOptions5 = {
  markdownLinkResolution: "absolute",
  prettyLinks: true
};
var CrawlLinks = /* @__PURE__ */ __name((userOpts) => {
  const opts = { ...defaultOptions5, ...userOpts };
  return {
    name: "LinkProcessing",
    htmlPlugins(ctx) {
      return [
        () => {
          return (tree, file) => {
            const curSlug = simplifySlug(file.data.slug);
            const outgoing = /* @__PURE__ */ new Set();
            const transformOptions = {
              strategy: opts.markdownLinkResolution,
              allSlugs: ctx.allSlugs
            };
            visit(tree, "element", (node, _index, _parent) => {
              if (node.tagName === "a" && node.properties && typeof node.properties.href === "string") {
                let dest = node.properties.href;
                node.properties.className ??= [];
                node.properties.className.push(isAbsoluteUrl(dest) ? "external" : "internal");
                if (!(isAbsoluteUrl(dest) || dest.startsWith("#"))) {
                  dest = node.properties.href = transformLink(
                    file.data.slug,
                    dest,
                    transformOptions
                  );
                  const url = new URL(dest, `https://base.com/${curSlug}`);
                  const canonicalDest = url.pathname;
                  const [destCanonical, _destAnchor] = splitAnchor(canonicalDest);
                  const simple = decodeURIComponent(
                    simplifySlug(destCanonical)
                  );
                  outgoing.add(simple);
                }
                if (opts.prettyLinks && node.children.length === 1 && node.children[0].type === "text" && !node.children[0].value.startsWith("#")) {
                  node.children[0].value = path2.basename(node.children[0].value);
                }
              }
              if (["img", "video", "audio", "iframe"].includes(node.tagName) && node.properties && typeof node.properties.src === "string") {
                if (!isAbsoluteUrl(node.properties.src)) {
                  let dest = node.properties.src;
                  dest = node.properties.src = transformLink(
                    file.data.slug,
                    dest,
                    transformOptions
                  );
                  node.properties.src = dest;
                }
              }
            });
            file.data.links = [...outgoing];
          };
        }
      ];
    }
  };
}, "CrawlLinks");

// quartz/plugins/transformers/ofm.ts
import { findAndReplace as mdastFindReplace } from "mdast-util-find-and-replace";
import { slug as slugAnchor2 } from "github-slugger";
import rehypeRaw from "rehype-raw";
import { visit as visit2 } from "unist-util-visit";
import path3 from "path";

// quartz/components/scripts/callout.inline.ts
var callout_inline_default = "";

// quartz/plugins/transformers/ofm.ts
import { toHast } from "mdast-util-to-hast";
import { toHtml } from "hast-util-to-html";
var defaultOptions6 = {
  comments: true,
  highlight: true,
  wikilinks: true,
  callouts: true,
  mermaid: true,
  parseTags: true,
  enableInHtmlEmbed: false
};
var icons = {
  infoIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`,
  pencilIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="2" x2="22" y2="6"></line><path d="M7.5 20.5 19 9l-4-4L3.5 16.5 2 22z"></path></svg>`,
  clipboardListIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><path d="M12 11h4"></path><path d="M12 16h4"></path><path d="M8 11h.01"></path><path d="M8 16h.01"></path></svg>`,
  checkCircleIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="m9 12 2 2 4-4"></path></svg>`,
  flameIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>`,
  checkIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
  helpCircleIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
  alertTriangleIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
  xIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
  zapIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`,
  bugIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="8" height="14" x="8" y="6" rx="4"></rect><path d="m19 7-3 2"></path><path d="m5 7 3 2"></path><path d="m19 19-3-2"></path><path d="m5 19 3-2"></path><path d="M20 13h-4"></path><path d="M4 13h4"></path><path d="m10 4 1 2"></path><path d="m14 4-1 2"></path></svg>`,
  listIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>`,
  quoteIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path></svg>`
};
var callouts = {
  note: icons.pencilIcon,
  abstract: icons.clipboardListIcon,
  info: icons.infoIcon,
  todo: icons.checkCircleIcon,
  tip: icons.flameIcon,
  success: icons.checkIcon,
  question: icons.helpCircleIcon,
  warning: icons.alertTriangleIcon,
  failure: icons.xIcon,
  danger: icons.zapIcon,
  bug: icons.bugIcon,
  example: icons.listIcon,
  quote: icons.quoteIcon
};
var calloutMapping = {
  note: "note",
  abstract: "abstract",
  info: "info",
  todo: "todo",
  tip: "tip",
  hint: "tip",
  important: "tip",
  success: "success",
  check: "success",
  done: "success",
  question: "question",
  help: "question",
  faq: "question",
  warning: "warning",
  attention: "warning",
  caution: "warning",
  failure: "failure",
  missing: "failure",
  fail: "failure",
  danger: "danger",
  error: "danger",
  bug: "bug",
  example: "example",
  quote: "quote",
  cite: "quote"
};
function canonicalizeCallout(calloutName) {
  let callout = calloutName.toLowerCase();
  return calloutMapping[callout] ?? calloutName;
}
__name(canonicalizeCallout, "canonicalizeCallout");
var capitalize = /* @__PURE__ */ __name((s) => {
  return s.substring(0, 1).toUpperCase() + s.substring(1);
}, "capitalize");
var wikilinkRegex = new RegExp(/!?\[\[([^\[\]\|\#]+)?(#[^\[\]\|\#]+)?(\|[^\[\]\|\#]+)?\]\]/, "g");
var highlightRegex = new RegExp(/==(.+)==/, "g");
var commentRegex = new RegExp(/%%(.+)%%/, "g");
var calloutRegex = new RegExp(/^\[\!(\w+)\]([+-]?)/);
var calloutLineRegex = new RegExp(/^> *\[\!\w+\][+-]?.*$/, "gm");
var tagRegex = new RegExp(/(?:^| )#(\p{L}+)/, "gu");
var ObsidianFlavoredMarkdown = /* @__PURE__ */ __name((userOpts) => {
  const opts = { ...defaultOptions6, ...userOpts };
  const mdastToHtml = /* @__PURE__ */ __name((ast) => {
    const hast = toHast(ast, { allowDangerousHtml: true });
    return toHtml(hast, { allowDangerousHtml: true });
  }, "mdastToHtml");
  const findAndReplace = opts.enableInHtmlEmbed ? (tree, regex, replace) => {
    if (replace) {
      visit2(tree, "html", (node) => {
        if (typeof replace === "string") {
          node.value = node.value.replace(regex, replace);
        } else {
          node.value = node.value.replaceAll(regex, (substring, ...args) => {
            const replaceValue = replace(substring, ...args);
            if (typeof replaceValue === "string") {
              return replaceValue;
            } else if (Array.isArray(replaceValue)) {
              return replaceValue.map(mdastToHtml).join("");
            } else if (typeof replaceValue === "object" && replaceValue !== null) {
              return mdastToHtml(replaceValue);
            } else {
              return substring;
            }
          });
        }
      });
    }
    mdastFindReplace(tree, regex, replace);
  } : mdastFindReplace;
  return {
    name: "ObsidianFlavoredMarkdown",
    textTransform(_ctx, src) {
      if (opts.callouts) {
        src = src.toString();
        src = src.replaceAll(calloutLineRegex, (value) => {
          return value + "\n> ";
        });
      }
      if (opts.wikilinks) {
        src = src.toString();
        src = src.replaceAll(wikilinkRegex, (value, ...capture) => {
          const [rawFp, rawHeader, rawAlias] = capture;
          const fp = rawFp ?? "";
          const anchor = rawHeader?.trim().slice(1);
          const displayAnchor = anchor ? `#${slugAnchor2(anchor)}` : "";
          const displayAlias = rawAlias ?? rawHeader?.replace("#", "|") ?? "";
          const embedDisplay = value.startsWith("!") ? "!" : "";
          return `${embedDisplay}[[${fp}${displayAnchor}${displayAlias}]]`;
        });
      }
      return src;
    },
    markdownPlugins() {
      const plugins = [];
      if (opts.wikilinks) {
        plugins.push(() => {
          return (tree, _file) => {
            findAndReplace(tree, wikilinkRegex, (value, ...capture) => {
              let [rawFp, rawHeader, rawAlias] = capture;
              const fp = rawFp?.trim() ?? "";
              const anchor = rawHeader?.trim() ?? "";
              const alias = rawAlias?.slice(1).trim();
              if (value.startsWith("!")) {
                const ext = path3.extname(fp).toLowerCase();
                const url2 = slugifyFilePath(fp);
                if ([".png", ".jpg", ".jpeg", ".gif", ".bmp", ".svg"].includes(ext)) {
                  const dims = alias ?? "";
                  let [width, height] = dims.split("x", 2);
                  width ||= "auto";
                  height ||= "auto";
                  return {
                    type: "image",
                    url: url2,
                    data: {
                      hProperties: {
                        width,
                        height
                      }
                    }
                  };
                } else if ([".mp4", ".webm", ".ogv", ".mov", ".mkv"].includes(ext)) {
                  return {
                    type: "html",
                    value: `<video src="${url2}" controls></video>`
                  };
                } else if ([".mp3", ".webm", ".wav", ".m4a", ".ogg", ".3gp", ".flac"].includes(ext)) {
                  return {
                    type: "html",
                    value: `<audio src="${url2}" controls></audio>`
                  };
                } else if ([".pdf"].includes(ext)) {
                  return {
                    type: "html",
                    value: `<iframe src="${url2}"></iframe>`
                  };
                } else if (ext === "") {
                }
              }
              const url = fp + anchor;
              return {
                type: "link",
                url,
                children: [
                  {
                    type: "text",
                    value: alias ?? fp
                  }
                ]
              };
            });
          };
        });
      }
      if (opts.highlight) {
        plugins.push(() => {
          return (tree, _file) => {
            findAndReplace(tree, highlightRegex, (_value, ...capture) => {
              const [inner] = capture;
              return {
                type: "html",
                value: `<span class="text-highlight">${inner}</span>`
              };
            });
          };
        });
      }
      if (opts.comments) {
        plugins.push(() => {
          return (tree, _file) => {
            findAndReplace(tree, commentRegex, (_value, ..._capture) => {
              return {
                type: "text",
                value: ""
              };
            });
          };
        });
      }
      if (opts.callouts) {
        plugins.push(() => {
          return (tree, _file) => {
            visit2(tree, "blockquote", (node) => {
              if (node.children.length === 0) {
                return;
              }
              const firstChild = node.children[0];
              if (firstChild.type !== "paragraph" || firstChild.children[0]?.type !== "text") {
                return;
              }
              const text = firstChild.children[0].value;
              const restChildren = firstChild.children.slice(1);
              const [firstLine, ...remainingLines] = text.split("\n");
              const remainingText = remainingLines.join("\n");
              const match = firstLine.match(calloutRegex);
              if (match && match.input) {
                const [calloutDirective, typeString, collapseChar] = match;
                const calloutType = canonicalizeCallout(
                  typeString.toLowerCase()
                );
                const collapse = collapseChar === "+" || collapseChar === "-";
                const defaultState = collapseChar === "-" ? "collapsed" : "expanded";
                const titleContent = match.input.slice(calloutDirective.length).trim() || capitalize(calloutType);
                const titleNode = {
                  type: "paragraph",
                  children: [{ type: "text", value: titleContent + " " }, ...restChildren]
                };
                const title = mdastToHtml(titleNode);
                const toggleIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="fold">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>`;
                const titleHtml = {
                  type: "html",
                  value: `<div 
                  class="callout-title"
                >
                  <div class="callout-icon">${callouts[calloutType]}</div>
                  <div class="callout-title-inner">${title}</div>
                  ${collapse ? toggleIcon : ""}
                </div>`
                };
                const blockquoteContent = [titleHtml];
                if (remainingText.length > 0) {
                  blockquoteContent.push({
                    type: "paragraph",
                    children: [
                      {
                        type: "text",
                        value: remainingText
                      }
                    ]
                  });
                }
                node.children.splice(0, 1, ...blockquoteContent);
                node.data = {
                  hProperties: {
                    ...node.data?.hProperties ?? {},
                    className: `callout ${collapse ? "is-collapsible" : ""} ${defaultState === "collapsed" ? "is-collapsed" : ""}`,
                    "data-callout": calloutType,
                    "data-callout-fold": collapse
                  }
                };
              }
            });
          };
        });
      }
      if (opts.mermaid) {
        plugins.push(() => {
          return (tree, _file) => {
            visit2(tree, "code", (node) => {
              if (node.lang === "mermaid") {
                node.data = {
                  hProperties: {
                    className: ["mermaid"]
                  }
                };
              }
            });
          };
        });
      }
      if (opts.parseTags) {
        plugins.push(() => {
          return (tree, file) => {
            const base = pathToRoot(file.data.slug);
            findAndReplace(tree, tagRegex, (_value, tag) => {
              tag = slugTag(tag);
              if (file.data.frontmatter && !file.data.frontmatter.tags.includes(tag)) {
                file.data.frontmatter.tags.push(tag);
              }
              return {
                type: "link",
                url: base + `/tags/${tag}`,
                data: {
                  hProperties: {
                    className: ["tag-link"]
                  }
                },
                children: [
                  {
                    type: "text",
                    value: `#${tag}`
                  }
                ]
              };
            });
          };
        });
      }
      return plugins;
    },
    htmlPlugins() {
      return [rehypeRaw];
    },
    externalResources() {
      const js = [];
      if (opts.callouts) {
        js.push({
          script: callout_inline_default,
          loadTime: "afterDOMReady",
          contentType: "inline"
        });
      }
      if (opts.mermaid) {
        js.push({
          script: `
          import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.esm.min.mjs';
          const darkMode = document.documentElement.getAttribute('saved-theme') === 'dark'
          mermaid.initialize({ 
            startOnLoad: false,
            securityLevel: 'loose',
            theme: darkMode ? 'dark' : 'default'
          });
          document.addEventListener('nav', async () => {
            await mermaid.run({
              querySelector: '.mermaid'
            })
          });
          `,
          loadTime: "afterDOMReady",
          moduleType: "module",
          contentType: "inline"
        });
      }
      return { js };
    }
  };
}, "ObsidianFlavoredMarkdown");

// quartz/plugins/transformers/oxhugofm.ts
var relrefRegex = new RegExp(/\[([^\]]+)\]\(\{\{< relref "([^"]+)" >\}\}\)/, "g");
var predefinedHeadingIdRegex = new RegExp(/(.*) {#(?:.*)}/, "g");
var hugoShortcodeRegex = new RegExp(/{{(.*)}}/, "g");
var figureTagRegex = new RegExp(/< ?figure src="(.*)" ?>/, "g");

// quartz/plugins/transformers/syntax.ts
import rehypePrettyCode from "rehype-pretty-code";
var SyntaxHighlighting = /* @__PURE__ */ __name(() => ({
  name: "SyntaxHighlighting",
  htmlPlugins() {
    return [
      [
        rehypePrettyCode,
        {
          theme: "css-variables"
        }
      ]
    ];
  }
}), "SyntaxHighlighting");

// quartz/plugins/transformers/toc.ts
import { visit as visit3 } from "unist-util-visit";
import { toString as toString2 } from "mdast-util-to-string";
import Slugger from "github-slugger";
var defaultOptions7 = {
  maxDepth: 3,
  minEntries: 1,
  showByDefault: true
};
var TableOfContents = /* @__PURE__ */ __name((userOpts) => {
  const opts = { ...defaultOptions7, ...userOpts };
  return {
    name: "TableOfContents",
    markdownPlugins() {
      return [
        () => {
          return async (tree, file) => {
            const display = file.data.frontmatter?.enableToc ?? opts.showByDefault;
            if (display) {
              const slugAnchor3 = new Slugger();
              const toc = [];
              let highestDepth = opts.maxDepth;
              visit3(tree, "heading", (node) => {
                if (node.depth <= opts.maxDepth) {
                  const text = toString2(node);
                  highestDepth = Math.min(highestDepth, node.depth);
                  toc.push({
                    depth: node.depth,
                    text,
                    slug: slugAnchor3.slug(text)
                  });
                }
              });
              if (toc.length > opts.minEntries) {
                file.data.toc = toc.map((entry) => ({
                  ...entry,
                  depth: entry.depth - highestDepth
                }));
              }
            }
          };
        }
      ];
    }
  };
}, "TableOfContents");

// quartz/plugins/filters/draft.ts
var RemoveDrafts = /* @__PURE__ */ __name(() => ({
  name: "RemoveDrafts",
  shouldPublish(_ctx, [_tree, vfile]) {
    const draftFlag = vfile.data?.frontmatter?.draft ?? false;
    return !draftFlag;
  }
}), "RemoveDrafts");

// quartz/components/Header.tsx
import { jsx } from "preact/jsx-runtime";
function Header({ children }) {
  return children.length > 0 ? /* @__PURE__ */ jsx("header", { children }) : null;
}
__name(Header, "Header");
Header.css = `
header {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 2rem 0;
  gap: 1.5rem;
}

header h1 {
  margin: 0;
  flex: auto;
}
`;
var Header_default = /* @__PURE__ */ __name(() => Header, "default");

// quartz/components/scripts/clipboard.inline.ts
var clipboard_inline_default = "";

// quartz/components/styles/clipboard.scss
var clipboard_default = "";

// quartz/components/Body.tsx
import { jsx as jsx2 } from "preact/jsx-runtime";
function Body({ children }) {
  return /* @__PURE__ */ jsx2("div", { id: "quartz-body", children });
}
__name(Body, "Body");
Body.afterDOMLoaded = clipboard_inline_default;
Body.css = clipboard_default;
var Body_default = /* @__PURE__ */ __name(() => Body, "default");

// quartz/components/renderPage.tsx
import { render } from "preact-render-to-string";

// quartz/util/resources.tsx
import { randomUUID } from "crypto";
import { jsx as jsx3 } from "preact/jsx-runtime";
function JSResourceToScriptElement(resource, preserve) {
  const scriptType = resource.moduleType ?? "application/javascript";
  const spaPreserve = preserve ?? resource.spaPreserve;
  if (resource.contentType === "external") {
    return /* @__PURE__ */ jsx3("script", { src: resource.src, type: scriptType, "spa-preserve": spaPreserve }, resource.src);
  } else {
    const content = resource.script;
    return /* @__PURE__ */ jsx3("script", { type: scriptType, "spa-preserve": spaPreserve, children: content }, randomUUID());
  }
}
__name(JSResourceToScriptElement, "JSResourceToScriptElement");

// quartz/components/renderPage.tsx
import { jsx as jsx4, jsxs } from "preact/jsx-runtime";
function pageResources(slug2, staticResources) {
  const baseDir = pathToRoot(slug2);
  const contentIndexPath = joinSegments(baseDir, "static/contentIndex.json");
  const contentIndexScript = `const fetchData = fetch(\`${contentIndexPath}\`).then(data => data.json())`;
  return {
    css: [joinSegments(baseDir, "index.css"), ...staticResources.css],
    js: [
      {
        src: joinSegments(baseDir, "prescript.js"),
        loadTime: "beforeDOMReady",
        contentType: "external"
      },
      {
        loadTime: "beforeDOMReady",
        contentType: "inline",
        spaPreserve: true,
        script: contentIndexScript
      },
      ...staticResources.js,
      {
        src: joinSegments(baseDir, "postscript.js"),
        loadTime: "afterDOMReady",
        moduleType: "module",
        contentType: "external"
      }
    ]
  };
}
__name(pageResources, "pageResources");
function renderPage(slug2, componentData, components, pageResources2) {
  const {
    head: Head,
    header,
    beforeBody,
    pageBody: Content2,
    left,
    right,
    footer: Footer
  } = components;
  const Header2 = Header_default();
  const Body2 = Body_default();
  const LeftComponent = /* @__PURE__ */ jsx4("div", { class: "left sidebar", children: left.map((BodyComponent) => /* @__PURE__ */ jsx4(BodyComponent, { ...componentData })) });
  const RightComponent = /* @__PURE__ */ jsx4("div", { class: "right sidebar", children: right.map((BodyComponent) => /* @__PURE__ */ jsx4(BodyComponent, { ...componentData })) });
  const doc = /* @__PURE__ */ jsxs("html", { children: [
    /* @__PURE__ */ jsx4(Head, { ...componentData }),
    /* @__PURE__ */ jsx4("body", { "data-slug": slug2, children: /* @__PURE__ */ jsxs("div", { id: "quartz-root", class: "page", children: [
      /* @__PURE__ */ jsxs(Body2, { ...componentData, children: [
        LeftComponent,
        /* @__PURE__ */ jsxs("div", { class: "center", children: [
          /* @__PURE__ */ jsxs("div", { class: "page-header", children: [
            /* @__PURE__ */ jsx4(Header2, { ...componentData, children: header.map((HeaderComponent) => /* @__PURE__ */ jsx4(HeaderComponent, { ...componentData })) }),
            /* @__PURE__ */ jsx4("div", { class: "popover-hint", children: beforeBody.map((BodyComponent) => /* @__PURE__ */ jsx4(BodyComponent, { ...componentData })) })
          ] }),
          /* @__PURE__ */ jsx4(Content2, { ...componentData })
        ] }),
        RightComponent
      ] }),
      /* @__PURE__ */ jsx4(Footer, { ...componentData })
    ] }) }),
    pageResources2.js.filter((resource) => resource.loadTime === "afterDOMReady").map((res) => JSResourceToScriptElement(res))
  ] });
  return "<!DOCTYPE html>\n" + render(doc);
}
__name(renderPage, "renderPage");

// quartz/components/ArticleTitle.tsx
import { jsx as jsx5 } from "preact/jsx-runtime";
function ArticleTitle({ fileData }) {
  const title = fileData.frontmatter?.title;
  if (title) {
    return /* @__PURE__ */ jsx5("h1", { class: "article-title", children: title });
  } else {
    return null;
  }
}
__name(ArticleTitle, "ArticleTitle");
ArticleTitle.css = `
.article-title {
  margin: 2rem 0 0 0;
}
`;
var ArticleTitle_default = /* @__PURE__ */ __name(() => ArticleTitle, "default");

// quartz/components/pages/Content.tsx
import { Fragment, jsx as jsx6, jsxs as jsxs2 } from "preact/jsx-runtime";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { jsx as jsx7 } from "preact/jsx-runtime";
function Content({ tree }) {
  const content = toJsxRuntime(tree, {
    Fragment,
    jsx: jsx6,
    jsxs: jsxs2,
    elementAttributeNameCase: "html"
  });
  return /* @__PURE__ */ jsx7("article", { class: "popover-hint", children: content });
}
__name(Content, "Content");
var Content_default = /* @__PURE__ */ __name(() => Content, "default");

// quartz/components/pages/TagContent.tsx
import { Fragment as Fragment3, jsx as jsx10, jsxs as jsxs4 } from "preact/jsx-runtime";
import { toJsxRuntime as toJsxRuntime2 } from "hast-util-to-jsx-runtime";

// quartz/components/styles/listPage.scss
var listPage_default = "";

// quartz/components/Date.tsx
import { Fragment as Fragment2, jsx as jsx8 } from "preact/jsx-runtime";
function getDate(cfg, data) {
  if (!cfg.defaultDateType) {
    throw new Error(
      `Field 'defaultDateType' was not set in the configuration object of quartz.config.ts. See https://quartz.jzhao.xyz/configuration#general-configuration for more details.`
    );
  }
  return data.dates?.[cfg.defaultDateType];
}
__name(getDate, "getDate");
function formatDate(d) {
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit"
  });
}
__name(formatDate, "formatDate");
function Date2({ date }) {
  return /* @__PURE__ */ jsx8(Fragment2, { children: formatDate(date) });
}
__name(Date2, "Date");

// quartz/components/PageList.tsx
import { jsx as jsx9, jsxs as jsxs3 } from "preact/jsx-runtime";
function byDateAndAlphabetical(cfg) {
  return (f1, f2) => {
    if (f1.dates && f2.dates) {
      return getDate(cfg, f2).getTime() - getDate(cfg, f1).getTime();
    } else if (f1.dates && !f2.dates) {
      return -1;
    } else if (!f1.dates && f2.dates) {
      return 1;
    }
    const f1Title = f1.frontmatter?.title.toLowerCase() ?? "";
    const f2Title = f2.frontmatter?.title.toLowerCase() ?? "";
    return f1Title.localeCompare(f2Title);
  };
}
__name(byDateAndAlphabetical, "byDateAndAlphabetical");
function PageList({ cfg, fileData, allFiles, limit }) {
  let list = allFiles.sort(byDateAndAlphabetical(cfg));
  if (limit) {
    list = list.slice(0, limit);
  }
  return /* @__PURE__ */ jsx9("ul", { class: "section-ul", children: list.map((page) => {
    const title = page.frontmatter?.title;
    const tags = page.frontmatter?.tags ?? [];
    return /* @__PURE__ */ jsx9("li", { class: "section-li", children: /* @__PURE__ */ jsxs3("div", { class: "section", children: [
      page.dates && /* @__PURE__ */ jsx9("p", { class: "meta", children: /* @__PURE__ */ jsx9(Date2, { date: getDate(cfg, page) }) }),
      /* @__PURE__ */ jsx9("div", { class: "desc", children: /* @__PURE__ */ jsx9("h3", { children: /* @__PURE__ */ jsx9("a", { href: resolveRelative(fileData.slug, page.slug), class: "internal", children: title }) }) }),
      /* @__PURE__ */ jsx9("ul", { class: "tags", children: tags.map((tag) => /* @__PURE__ */ jsx9("li", { children: /* @__PURE__ */ jsxs3(
        "a",
        {
          class: "internal tag-link",
          href: resolveRelative(fileData.slug, `tags/${tag}`),
          children: [
            "#",
            tag
          ]
        }
      ) })) })
    ] }) });
  }) });
}
__name(PageList, "PageList");
PageList.css = `
.section h3 {
  margin: 0;
}

.section > .tags {
  margin: 0;
}
`;

// quartz/components/pages/TagContent.tsx
import { jsx as jsx11, jsxs as jsxs5 } from "preact/jsx-runtime";
var numPages = 10;
function TagContent(props) {
  const { tree, fileData, allFiles } = props;
  const slug2 = fileData.slug;
  if (!(slug2?.startsWith("tags/") || slug2 === "tags")) {
    throw new Error(`Component "TagContent" tried to render a non-tag page: ${slug2}`);
  }
  const tag = simplifySlug(slug2.slice("tags/".length));
  const allPagesWithTag = /* @__PURE__ */ __name((tag2) => allFiles.filter(
    (file) => (file.frontmatter?.tags ?? []).flatMap(getAllSegmentPrefixes).includes(tag2)
  ), "allPagesWithTag");
  const content = tree.children.length === 0 ? fileData.description : (
    // @ts-ignore
    toJsxRuntime2(tree, {
      Fragment: Fragment3,
      jsx: jsx10,
      jsxs: jsxs4,
      elementAttributeNameCase: "html"
    })
  );
  if (tag === "") {
    const tags = [...new Set(allFiles.flatMap((data) => data.frontmatter?.tags ?? []))];
    const tagItemMap = /* @__PURE__ */ new Map();
    for (const tag2 of tags) {
      tagItemMap.set(tag2, allPagesWithTag(tag2));
    }
    return /* @__PURE__ */ jsxs5("div", { class: "popover-hint", children: [
      /* @__PURE__ */ jsx11("article", { children: /* @__PURE__ */ jsx11("p", { children: content }) }),
      /* @__PURE__ */ jsxs5("p", { children: [
        "Found ",
        tags.length,
        " total tags."
      ] }),
      /* @__PURE__ */ jsx11("div", { children: tags.map((tag2) => {
        const pages = tagItemMap.get(tag2);
        const listProps = {
          ...props,
          allFiles: pages
        };
        const contentPage = allFiles.filter((file) => file.slug === `tags/${tag2}`)[0];
        const content2 = contentPage?.description;
        return /* @__PURE__ */ jsxs5("div", { children: [
          /* @__PURE__ */ jsx11("h2", { children: /* @__PURE__ */ jsxs5("a", { class: "internal tag-link", href: `./${tag2}`, children: [
            "#",
            tag2
          ] }) }),
          content2 && /* @__PURE__ */ jsx11("p", { children: content2 }),
          /* @__PURE__ */ jsxs5("p", { children: [
            pages.length,
            " items with this tag.",
            " ",
            pages.length > numPages && `Showing first ${numPages}.`
          ] }),
          /* @__PURE__ */ jsx11(PageList, { limit: numPages, ...listProps })
        ] });
      }) })
    ] });
  } else {
    const pages = allPagesWithTag(tag);
    const listProps = {
      ...props,
      allFiles: pages
    };
    return /* @__PURE__ */ jsxs5("div", { class: "popover-hint", children: [
      /* @__PURE__ */ jsx11("article", { children: content }),
      /* @__PURE__ */ jsxs5("p", { children: [
        pages.length,
        " items with this tag."
      ] }),
      /* @__PURE__ */ jsx11("div", { children: /* @__PURE__ */ jsx11(PageList, { ...listProps }) })
    ] });
  }
}
__name(TagContent, "TagContent");
TagContent.css = listPage_default + PageList.css;
var TagContent_default = /* @__PURE__ */ __name(() => TagContent, "default");

// quartz/components/pages/FolderContent.tsx
import { Fragment as Fragment4, jsx as jsx12, jsxs as jsxs6 } from "preact/jsx-runtime";
import { toJsxRuntime as toJsxRuntime3 } from "hast-util-to-jsx-runtime";
import path4 from "path";
import { jsx as jsx13, jsxs as jsxs7 } from "preact/jsx-runtime";
function FolderContent(props) {
  const { tree, fileData, allFiles } = props;
  const folderSlug = _stripSlashes(simplifySlug(fileData.slug));
  const allPagesInFolder = allFiles.filter((file) => {
    const fileSlug = _stripSlashes(simplifySlug(file.slug));
    const prefixed = fileSlug.startsWith(folderSlug) && fileSlug !== folderSlug;
    const folderParts = folderSlug.split(path4.posix.sep);
    const fileParts = fileSlug.split(path4.posix.sep);
    const isDirectChild = fileParts.length === folderParts.length + 1;
    return prefixed && isDirectChild;
  });
  const listProps = {
    ...props,
    allFiles: allPagesInFolder
  };
  const content = tree.children.length === 0 ? fileData.description : (
    // @ts-ignore
    toJsxRuntime3(tree, {
      Fragment: Fragment4,
      jsx: jsx12,
      jsxs: jsxs6,
      elementAttributeNameCase: "html"
    })
  );
  return /* @__PURE__ */ jsxs7("div", { class: "popover-hint", children: [
    /* @__PURE__ */ jsx13("article", { children: /* @__PURE__ */ jsx13("p", { children: content }) }),
    /* @__PURE__ */ jsxs7("p", { children: [
      allPagesInFolder.length,
      " items under this folder."
    ] }),
    /* @__PURE__ */ jsx13("div", { children: /* @__PURE__ */ jsx13(PageList, { ...listProps }) })
  ] });
}
__name(FolderContent, "FolderContent");
FolderContent.css = listPage_default + PageList.css;
var FolderContent_default = /* @__PURE__ */ __name(() => FolderContent, "default");

// quartz/components/scripts/darkmode.inline.ts
var darkmode_inline_default = "";

// quartz/components/styles/darkmode.scss
var darkmode_default = "";

// quartz/components/Darkmode.tsx
import { jsx as jsx14, jsxs as jsxs8 } from "preact/jsx-runtime";
function Darkmode() {
  return /* @__PURE__ */ jsxs8("div", { class: "darkmode", children: [
    /* @__PURE__ */ jsx14("input", { class: "toggle", id: "darkmode-toggle", type: "checkbox", tabIndex: -1 }),
    /* @__PURE__ */ jsx14("label", { id: "toggle-label-light", for: "darkmode-toggle", tabIndex: -1, children: /* @__PURE__ */ jsxs8(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        xmlnsXlink: "http://www.w3.org/1999/xlink",
        version: "1.1",
        id: "dayIcon",
        x: "0px",
        y: "0px",
        viewBox: "0 0 35 35",
        style: "enable-background:new 0 0 35 35;",
        xmlSpace: "preserve",
        children: [
          /* @__PURE__ */ jsx14("title", { children: "Light mode" }),
          /* @__PURE__ */ jsx14("path", { d: "M6,17.5C6,16.672,5.328,16,4.5,16h-3C0.672,16,0,16.672,0,17.5    S0.672,19,1.5,19h3C5.328,19,6,18.328,6,17.5z M7.5,26c-0.414,0-0.789,0.168-1.061,0.439l-2,2C4.168,28.711,4,29.086,4,29.5    C4,30.328,4.671,31,5.5,31c0.414,0,0.789-0.168,1.06-0.44l2-2C8.832,28.289,9,27.914,9,27.5C9,26.672,8.329,26,7.5,26z M17.5,6    C18.329,6,19,5.328,19,4.5v-3C19,0.672,18.329,0,17.5,0S16,0.672,16,1.5v3C16,5.328,16.671,6,17.5,6z M27.5,9    c0.414,0,0.789-0.168,1.06-0.439l2-2C30.832,6.289,31,5.914,31,5.5C31,4.672,30.329,4,29.5,4c-0.414,0-0.789,0.168-1.061,0.44    l-2,2C26.168,6.711,26,7.086,26,7.5C26,8.328,26.671,9,27.5,9z M6.439,8.561C6.711,8.832,7.086,9,7.5,9C8.328,9,9,8.328,9,7.5    c0-0.414-0.168-0.789-0.439-1.061l-2-2C6.289,4.168,5.914,4,5.5,4C4.672,4,4,4.672,4,5.5c0,0.414,0.168,0.789,0.439,1.06    L6.439,8.561z M33.5,16h-3c-0.828,0-1.5,0.672-1.5,1.5s0.672,1.5,1.5,1.5h3c0.828,0,1.5-0.672,1.5-1.5S34.328,16,33.5,16z     M28.561,26.439C28.289,26.168,27.914,26,27.5,26c-0.828,0-1.5,0.672-1.5,1.5c0,0.414,0.168,0.789,0.439,1.06l2,2    C28.711,30.832,29.086,31,29.5,31c0.828,0,1.5-0.672,1.5-1.5c0-0.414-0.168-0.789-0.439-1.061L28.561,26.439z M17.5,29    c-0.829,0-1.5,0.672-1.5,1.5v3c0,0.828,0.671,1.5,1.5,1.5s1.5-0.672,1.5-1.5v-3C19,29.672,18.329,29,17.5,29z M17.5,7    C11.71,7,7,11.71,7,17.5S11.71,28,17.5,28S28,23.29,28,17.5S23.29,7,17.5,7z M17.5,25c-4.136,0-7.5-3.364-7.5-7.5    c0-4.136,3.364-7.5,7.5-7.5c4.136,0,7.5,3.364,7.5,7.5C25,21.636,21.636,25,17.5,25z" })
        ]
      }
    ) }),
    /* @__PURE__ */ jsx14("label", { id: "toggle-label-dark", for: "darkmode-toggle", tabIndex: -1, children: /* @__PURE__ */ jsxs8(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        xmlnsXlink: "http://www.w3.org/1999/xlink",
        version: "1.1",
        id: "nightIcon",
        x: "0px",
        y: "0px",
        viewBox: "0 0 100 100",
        style: "enable-background='new 0 0 100 100'",
        xmlSpace: "preserve",
        children: [
          /* @__PURE__ */ jsx14("title", { children: "Dark mode" }),
          /* @__PURE__ */ jsx14("path", { d: "M96.76,66.458c-0.853-0.852-2.15-1.064-3.23-0.534c-6.063,2.991-12.858,4.571-19.655,4.571  C62.022,70.495,50.88,65.88,42.5,57.5C29.043,44.043,25.658,23.536,34.076,6.47c0.532-1.08,0.318-2.379-0.534-3.23  c-0.851-0.852-2.15-1.064-3.23-0.534c-4.918,2.427-9.375,5.619-13.246,9.491c-9.447,9.447-14.65,22.008-14.65,35.369  c0,13.36,5.203,25.921,14.65,35.368s22.008,14.65,35.368,14.65c13.361,0,25.921-5.203,35.369-14.65  c3.872-3.871,7.064-8.328,9.491-13.246C97.826,68.608,97.611,67.309,96.76,66.458z" })
        ]
      }
    ) })
  ] });
}
__name(Darkmode, "Darkmode");
Darkmode.beforeDOMLoaded = darkmode_inline_default;
Darkmode.css = darkmode_default;
var Darkmode_default = /* @__PURE__ */ __name(() => Darkmode, "default");

// quartz/components/Head.tsx
import { jsx as jsx15, jsxs as jsxs9 } from "preact/jsx-runtime";
var Head_default = /* @__PURE__ */ __name(() => {
  function Head({ cfg, fileData, externalResources }) {
    const title = fileData.frontmatter?.title ?? "Untitled";
    const description = fileData.description?.trim() ?? "No description provided";
    const { css, js } = externalResources;
    const baseDir = pathToRoot(fileData.slug);
    const iconPath = joinSegments(baseDir, "static/icon.png");
    const ogImagePath = `https://${cfg.baseUrl}/static/og-image.png`;
    return /* @__PURE__ */ jsxs9("head", { children: [
      /* @__PURE__ */ jsx15("title", { children: title }),
      /* @__PURE__ */ jsx15("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsx15("meta", { name: "viewport", content: "width=device-width, initial-scale=1.0" }),
      /* @__PURE__ */ jsx15("meta", { property: "og:title", content: title }),
      /* @__PURE__ */ jsx15("meta", { property: "og:description", content: description }),
      cfg.baseUrl && /* @__PURE__ */ jsx15("meta", { property: "og:image", content: ogImagePath }),
      /* @__PURE__ */ jsx15("meta", { property: "og:width", content: "1200" }),
      /* @__PURE__ */ jsx15("meta", { property: "og:height", content: "675" }),
      /* @__PURE__ */ jsx15("link", { rel: "icon", href: iconPath }),
      /* @__PURE__ */ jsx15("meta", { name: "description", content: description }),
      /* @__PURE__ */ jsx15("meta", { name: "generator", content: "Quartz" }),
      /* @__PURE__ */ jsx15("link", { rel: "preconnect", href: "https://fonts.googleapis.com" }),
      /* @__PURE__ */ jsx15("link", { rel: "preconnect", href: "https://fonts.gstatic.com" }),
      css.map((href) => /* @__PURE__ */ jsx15("link", { href, rel: "stylesheet", type: "text/css", "spa-preserve": true }, href)),
      js.filter((resource) => resource.loadTime === "beforeDOMReady").map((res) => JSResourceToScriptElement(res, true))
    ] });
  }
  __name(Head, "Head");
  return Head;
}, "default");

// quartz/components/PageTitle.tsx
import { jsx as jsx16 } from "preact/jsx-runtime";
function PageTitle({ fileData, cfg }) {
  const title = cfg?.pageTitle ?? "Untitled Quartz";
  const baseDir = pathToRoot(fileData.slug);
  return /* @__PURE__ */ jsx16("h1", { class: "page-title", children: /* @__PURE__ */ jsx16("a", { href: baseDir, children: title }) });
}
__name(PageTitle, "PageTitle");
PageTitle.css = `
.page-title {
  margin: 0;
}
`;
var PageTitle_default = /* @__PURE__ */ __name(() => PageTitle, "default");

// quartz/components/ContentMeta.tsx
import readingTime from "reading-time";
import { jsx as jsx17 } from "preact/jsx-runtime";
var ContentMeta_default = /* @__PURE__ */ __name(() => {
  function ContentMetadata({ cfg, fileData }) {
    const text = fileData.text;
    if (text) {
      const segments = [];
      const { text: timeTaken, words: _words } = readingTime(text);
      if (fileData.dates) {
        segments.push(formatDate(getDate(cfg, fileData)));
      }
      segments.push(timeTaken);
      return /* @__PURE__ */ jsx17("p", { class: "content-meta", children: segments.join(", ") });
    } else {
      return null;
    }
  }
  __name(ContentMetadata, "ContentMetadata");
  ContentMetadata.css = `
  .content-meta {
    margin-top: 0;
    color: var(--gray);
  }
  `;
  return ContentMetadata;
}, "default");

// quartz/components/Spacer.tsx
import { jsx as jsx18 } from "preact/jsx-runtime";
function Spacer({ displayClass }) {
  const className = displayClass ? `spacer ${displayClass}` : "spacer";
  return /* @__PURE__ */ jsx18("div", { class: className });
}
__name(Spacer, "Spacer");
var Spacer_default = /* @__PURE__ */ __name(() => Spacer, "default");

// quartz/components/styles/legacyToc.scss
var legacyToc_default = "";

// quartz/components/styles/toc.scss
var toc_default = "";

// quartz/components/scripts/toc.inline.ts
var toc_inline_default = "";

// quartz/components/TableOfContents.tsx
import { jsx as jsx19, jsxs as jsxs10 } from "preact/jsx-runtime";
var defaultOptions8 = {
  layout: "modern"
};
function TableOfContents2({ fileData, displayClass }) {
  if (!fileData.toc) {
    return null;
  }
  return /* @__PURE__ */ jsxs10("div", { class: `toc ${displayClass}`, children: [
    /* @__PURE__ */ jsxs10("button", { type: "button", id: "toc", children: [
      /* @__PURE__ */ jsx19("h3", { children: "Table of Contents" }),
      /* @__PURE__ */ jsx19(
        "svg",
        {
          xmlns: "http://www.w3.org/2000/svg",
          width: "24",
          height: "24",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          "stroke-width": "2",
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          class: "fold",
          children: /* @__PURE__ */ jsx19("polyline", { points: "6 9 12 15 18 9" })
        }
      )
    ] }),
    /* @__PURE__ */ jsx19("div", { id: "toc-content", children: /* @__PURE__ */ jsx19("ul", { class: "overflow", children: fileData.toc.map((tocEntry) => /* @__PURE__ */ jsx19("li", { class: `depth-${tocEntry.depth}`, children: /* @__PURE__ */ jsx19("a", { href: `#${tocEntry.slug}`, "data-for": tocEntry.slug, children: tocEntry.text }) }, tocEntry.slug)) }) })
  ] });
}
__name(TableOfContents2, "TableOfContents");
TableOfContents2.css = toc_default;
TableOfContents2.afterDOMLoaded = toc_inline_default;
function LegacyTableOfContents({ fileData }) {
  if (!fileData.toc) {
    return null;
  }
  return /* @__PURE__ */ jsxs10("details", { id: "toc", open: true, children: [
    /* @__PURE__ */ jsx19("summary", { children: /* @__PURE__ */ jsx19("h3", { children: "Table of Contents" }) }),
    /* @__PURE__ */ jsx19("ul", { children: fileData.toc.map((tocEntry) => /* @__PURE__ */ jsx19("li", { class: `depth-${tocEntry.depth}`, children: /* @__PURE__ */ jsx19("a", { href: `#${tocEntry.slug}`, "data-for": tocEntry.slug, children: tocEntry.text }) }, tocEntry.slug)) })
  ] });
}
__name(LegacyTableOfContents, "LegacyTableOfContents");
LegacyTableOfContents.css = legacyToc_default;
var TableOfContents_default = /* @__PURE__ */ __name((opts) => {
  const layout = opts?.layout ?? defaultOptions8.layout;
  return layout === "modern" ? TableOfContents2 : LegacyTableOfContents;
}, "default");

// quartz/components/TagList.tsx
import { jsx as jsx20 } from "preact/jsx-runtime";
function TagList({ fileData }) {
  const tags = fileData.frontmatter?.tags;
  const baseDir = pathToRoot(fileData.slug);
  if (tags && tags.length > 0) {
    return /* @__PURE__ */ jsx20("ul", { class: "tags", children: tags.map((tag) => {
      const display = `#${tag}`;
      const linkDest = baseDir + `/tags/${slugTag(tag)}`;
      return /* @__PURE__ */ jsx20("li", { children: /* @__PURE__ */ jsx20("a", { href: linkDest, class: "internal tag-link", children: display }) });
    }) });
  } else {
    return null;
  }
}
__name(TagList, "TagList");
TagList.css = `
.tags {
  list-style: none;
  display: flex;
  padding-left: 0;
  gap: 0.4rem;
  margin: 1rem 0;
}
  
.tags > li {
  display: inline-block;
  white-space: nowrap;
  margin: 0;
  overflow-wrap: normal;
}

a.tag-link {
  border-radius: 8px;
  background-color: var(--highlight);
  padding: 0.2rem 0.4rem;
  margin: 0 0.1rem;
}
`;
var TagList_default = /* @__PURE__ */ __name(() => TagList, "default");

// quartz/components/scripts/graph.inline.ts
var graph_inline_default = "";

// quartz/components/styles/graph.scss
var graph_default = "";

// quartz/components/Graph.tsx
import { jsx as jsx21, jsxs as jsxs11 } from "preact/jsx-runtime";
var defaultOptions9 = {
  localGraph: {
    drag: true,
    zoom: true,
    depth: 1,
    scale: 1.1,
    repelForce: 0.5,
    centerForce: 0.3,
    linkDistance: 30,
    fontSize: 0.6,
    opacityScale: 1
  },
  globalGraph: {
    drag: true,
    zoom: true,
    depth: -1,
    scale: 0.9,
    repelForce: 0.5,
    centerForce: 0.3,
    linkDistance: 30,
    fontSize: 0.6,
    opacityScale: 1
  }
};
var Graph_default = /* @__PURE__ */ __name((opts) => {
  function Graph() {
    const localGraph = { ...defaultOptions9.localGraph, ...opts?.localGraph };
    const globalGraph = { ...defaultOptions9.globalGraph, ...opts?.globalGraph };
    return /* @__PURE__ */ jsxs11("div", { class: "graph", children: [
      /* @__PURE__ */ jsx21("h3", { children: "Graph View" }),
      /* @__PURE__ */ jsxs11("div", { class: "graph-outer", children: [
        /* @__PURE__ */ jsx21("div", { id: "graph-container", "data-cfg": JSON.stringify(localGraph) }),
        /* @__PURE__ */ jsx21(
          "svg",
          {
            version: "1.1",
            id: "global-graph-icon",
            xmlns: "http://www.w3.org/2000/svg",
            xmlnsXlink: "http://www.w3.org/1999/xlink",
            x: "0px",
            y: "0px",
            viewBox: "0 0 55 55",
            fill: "currentColor",
            xmlSpace: "preserve",
            children: /* @__PURE__ */ jsx21(
              "path",
              {
                d: "M49,0c-3.309,0-6,2.691-6,6c0,1.035,0.263,2.009,0.726,2.86l-9.829,9.829C32.542,17.634,30.846,17,29,17\n	s-3.542,0.634-4.898,1.688l-7.669-7.669C16.785,10.424,17,9.74,17,9c0-2.206-1.794-4-4-4S9,6.794,9,9s1.794,4,4,4\n	c0.74,0,1.424-0.215,2.019-0.567l7.669,7.669C21.634,21.458,21,23.154,21,25s0.634,3.542,1.688,4.897L10.024,42.562\n	C8.958,41.595,7.549,41,6,41c-3.309,0-6,2.691-6,6s2.691,6,6,6s6-2.691,6-6c0-1.035-0.263-2.009-0.726-2.86l12.829-12.829\n	c1.106,0.86,2.44,1.436,3.898,1.619v10.16c-2.833,0.478-5,2.942-5,5.91c0,3.309,2.691,6,6,6s6-2.691,6-6c0-2.967-2.167-5.431-5-5.91\n	v-10.16c1.458-0.183,2.792-0.759,3.898-1.619l7.669,7.669C41.215,39.576,41,40.26,41,41c0,2.206,1.794,4,4,4s4-1.794,4-4\n	s-1.794-4-4-4c-0.74,0-1.424,0.215-2.019,0.567l-7.669-7.669C36.366,28.542,37,26.846,37,25s-0.634-3.542-1.688-4.897l9.665-9.665\n	C46.042,11.405,47.451,12,49,12c3.309,0,6-2.691,6-6S52.309,0,49,0z M11,9c0-1.103,0.897-2,2-2s2,0.897,2,2s-0.897,2-2,2\n	S11,10.103,11,9z M6,51c-2.206,0-4-1.794-4-4s1.794-4,4-4s4,1.794,4,4S8.206,51,6,51z M33,49c0,2.206-1.794,4-4,4s-4-1.794-4-4\n	s1.794-4,4-4S33,46.794,33,49z M29,31c-3.309,0-6-2.691-6-6s2.691-6,6-6s6,2.691,6,6S32.309,31,29,31z M47,41c0,1.103-0.897,2-2,2\n	s-2-0.897-2-2s0.897-2,2-2S47,39.897,47,41z M49,10c-2.206,0-4-1.794-4-4s1.794-4,4-4s4,1.794,4,4S51.206,10,49,10z"
              }
            )
          }
        )
      ] }),
      /* @__PURE__ */ jsx21("div", { id: "global-graph-outer", children: /* @__PURE__ */ jsx21("div", { id: "global-graph-container", "data-cfg": JSON.stringify(globalGraph) }) })
    ] });
  }
  __name(Graph, "Graph");
  Graph.css = graph_default;
  Graph.afterDOMLoaded = graph_inline_default;
  return Graph;
}, "default");

// quartz/components/styles/backlinks.scss
var backlinks_default = "";

// quartz/components/Backlinks.tsx
import { jsx as jsx22, jsxs as jsxs12 } from "preact/jsx-runtime";
function Backlinks({ fileData, allFiles }) {
  const slug2 = simplifySlug(fileData.slug);
  const backlinkFiles = allFiles.filter((file) => file.links?.includes(slug2));
  return /* @__PURE__ */ jsxs12("div", { class: "backlinks", children: [
    /* @__PURE__ */ jsx22("h3", { children: "Backlinks" }),
    /* @__PURE__ */ jsx22("ul", { class: "overflow", children: backlinkFiles.length > 0 ? backlinkFiles.map((f) => /* @__PURE__ */ jsx22("li", { children: /* @__PURE__ */ jsx22("a", { href: resolveRelative(fileData.slug, f.slug), class: "internal", children: f.frontmatter?.title }) })) : /* @__PURE__ */ jsx22("li", { children: "No backlinks found" }) })
  ] });
}
__name(Backlinks, "Backlinks");
Backlinks.css = backlinks_default;
var Backlinks_default = /* @__PURE__ */ __name(() => Backlinks, "default");

// quartz/components/styles/search.scss
var search_default = "";

// quartz/components/scripts/search.inline.ts
var search_inline_default = "";

// quartz/components/Search.tsx
import { jsx as jsx23, jsxs as jsxs13 } from "preact/jsx-runtime";
var Search_default = /* @__PURE__ */ __name(() => {
  function Search() {
    return /* @__PURE__ */ jsxs13("div", { class: "search", children: [
      /* @__PURE__ */ jsxs13("div", { id: "search-icon", children: [
        /* @__PURE__ */ jsx23("p", { children: "Search" }),
        /* @__PURE__ */ jsx23("div", {}),
        /* @__PURE__ */ jsxs13(
          "svg",
          {
            tabIndex: 0,
            "aria-labelledby": "title desc",
            role: "img",
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 0 19.9 19.7",
            children: [
              /* @__PURE__ */ jsx23("title", { id: "title", children: "Search" }),
              /* @__PURE__ */ jsx23("desc", { id: "desc", children: "Search" }),
              /* @__PURE__ */ jsxs13("g", { class: "search-path", fill: "none", children: [
                /* @__PURE__ */ jsx23("path", { "stroke-linecap": "square", d: "M18.5 18.3l-5.4-5.4" }),
                /* @__PURE__ */ jsx23("circle", { cx: "8", cy: "8", r: "7" })
              ] })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx23("div", { id: "search-container", children: /* @__PURE__ */ jsxs13("div", { id: "search-space", children: [
        /* @__PURE__ */ jsx23(
          "input",
          {
            autocomplete: "off",
            id: "search-bar",
            name: "search",
            type: "text",
            "aria-label": "Search for something",
            placeholder: "Search for something"
          }
        ),
        /* @__PURE__ */ jsx23("div", { id: "results-container" })
      ] }) })
    ] });
  }
  __name(Search, "Search");
  Search.afterDOMLoaded = search_inline_default;
  Search.css = search_default;
  return Search;
}, "default");

// quartz/components/styles/footer.scss
var footer_default = "";

// package.json
var version = "4.0.10";

// quartz/components/Footer.tsx
import { jsx as jsx24, jsxs as jsxs14 } from "preact/jsx-runtime";
var Footer_default = /* @__PURE__ */ __name((opts) => {
  function Footer() {
    const year = (/* @__PURE__ */ new Date()).getFullYear();
    const links = opts?.links ?? [];
    return /* @__PURE__ */ jsxs14("footer", { children: [
      /* @__PURE__ */ jsx24("hr", {}),
      /* @__PURE__ */ jsxs14("p", { children: [
        "Created with ",
        /* @__PURE__ */ jsxs14("a", { href: "https://quartz.jzhao.xyz/", children: [
          "Quartz v",
          version
        ] }),
        ", \xA9 ",
        year
      ] }),
      /* @__PURE__ */ jsx24("ul", { children: Object.entries(links).map(([text, link]) => /* @__PURE__ */ jsx24("li", { children: /* @__PURE__ */ jsx24("a", { href: link, children: text }) })) }),
      /* @__PURE__ */ jsx24("img", { src: "https://visitor-badge.laobi.icu/badge?page_id=NotTacoz.NotTacoz" })
    ] });
  }
  __name(Footer, "Footer");
  Footer.css = footer_default;
  return Footer;
}, "default");

// quartz/components/DesktopOnly.tsx
import { Fragment as Fragment5, jsx as jsx25 } from "preact/jsx-runtime";
var DesktopOnly_default = /* @__PURE__ */ __name((component) => {
  if (component) {
    let DesktopOnly2 = function(props) {
      return /* @__PURE__ */ jsx25(Component, { displayClass: "desktop-only", ...props });
    };
    var DesktopOnly = DesktopOnly2;
    __name(DesktopOnly2, "DesktopOnly");
    const Component = component;
    DesktopOnly2.displayName = component.displayName;
    DesktopOnly2.afterDOMLoaded = component?.afterDOMLoaded;
    DesktopOnly2.beforeDOMLoaded = component?.beforeDOMLoaded;
    DesktopOnly2.css = component?.css;
    return DesktopOnly2;
  } else {
    return () => /* @__PURE__ */ jsx25(Fragment5, {});
  }
}, "default");

// quartz/components/MobileOnly.tsx
import { Fragment as Fragment6, jsx as jsx26 } from "preact/jsx-runtime";
var MobileOnly_default = /* @__PURE__ */ __name((component) => {
  if (component) {
    let MobileOnly2 = function(props) {
      return /* @__PURE__ */ jsx26(Component, { displayClass: "mobile-only", ...props });
    };
    var MobileOnly = MobileOnly2;
    __name(MobileOnly2, "MobileOnly");
    const Component = component;
    MobileOnly2.displayName = component.displayName;
    MobileOnly2.afterDOMLoaded = component?.afterDOMLoaded;
    MobileOnly2.beforeDOMLoaded = component?.beforeDOMLoaded;
    MobileOnly2.css = component?.css;
    return MobileOnly2;
  } else {
    return () => /* @__PURE__ */ jsx26(Fragment6, {});
  }
}, "default");

// quartz/components/styles/recentNotes.scss
var recentNotes_default = "";

// quartz/components/RecentNotes.tsx
import { jsx as jsx27, jsxs as jsxs15 } from "preact/jsx-runtime";
var defaultOptions10 = /* @__PURE__ */ __name((cfg) => ({
  title: "Recent Notes",
  limit: 3,
  linkToMore: false,
  filter: () => true,
  sort: byDateAndAlphabetical(cfg)
}), "defaultOptions");
var RecentNotes_default = /* @__PURE__ */ __name((userOpts) => {
  function RecentNotes(props) {
    const { allFiles, fileData, displayClass, cfg } = props;
    const opts = { ...defaultOptions10(cfg), ...userOpts };
    const pages = allFiles.filter(opts.filter).sort(opts.sort);
    const remaining = Math.max(0, pages.length - opts.limit);
    return /* @__PURE__ */ jsxs15("div", { class: `recent-notes ${displayClass}`, children: [
      /* @__PURE__ */ jsx27("h3", { children: opts.title }),
      /* @__PURE__ */ jsx27("ul", { class: "recent-ul", children: pages.slice(0, opts.limit).map((page) => {
        const title = page.frontmatter?.title;
        const tags = page.frontmatter?.tags ?? [];
        return /* @__PURE__ */ jsx27("li", { class: "recent-li", children: /* @__PURE__ */ jsxs15("div", { class: "section", children: [
          /* @__PURE__ */ jsx27("div", { class: "desc", children: /* @__PURE__ */ jsx27("h3", { children: /* @__PURE__ */ jsx27("a", { href: resolveRelative(fileData.slug, page.slug), class: "internal", children: title }) }) }),
          page.dates && /* @__PURE__ */ jsx27("p", { class: "meta", children: /* @__PURE__ */ jsx27(Date2, { date: getDate(cfg, page) }) }),
          /* @__PURE__ */ jsx27("ul", { class: "tags", children: tags.map((tag) => /* @__PURE__ */ jsx27("li", { children: /* @__PURE__ */ jsxs15(
            "a",
            {
              class: "internal tag-link",
              href: resolveRelative(fileData.slug, `tags/${tag}`),
              children: [
                "#",
                tag
              ]
            }
          ) })) })
        ] }) });
      }) }),
      opts.linkToMore && remaining > 0 && /* @__PURE__ */ jsx27("p", { children: /* @__PURE__ */ jsxs15("a", { href: resolveRelative(fileData.slug, opts.linkToMore), children: [
        "See ",
        remaining,
        " more \u2192"
      ] }) })
    ] });
  }
  __name(RecentNotes, "RecentNotes");
  RecentNotes.css = recentNotes_default;
  return RecentNotes;
}, "default");

// quartz.layout.ts
var sharedPageComponents = {
  head: Head_default(),
  header: [],
  footer: Footer_default({
    links: {
      GitHub: "https://github.com/NotTacoz/jacaranda"
    }
  })
};
var defaultContentPageLayout = {
  beforeBody: [ArticleTitle_default(), ContentMeta_default(), TagList_default()],
  left: [
    PageTitle_default(),
    MobileOnly_default(Spacer_default()),
    Search_default(),
    Darkmode_default(),
    DesktopOnly_default(TableOfContents_default()),
    DesktopOnly_default(RecentNotes_default({
      title: "Recent Notes",
      limit: 3,
      filter: (f) => f.slug.startsWith("notes/") && !f.frontmatter?.noindex && f.frontmatter?.date,
      linkToMore: "notes/"
    }))
  ],
  right: [Graph_default(), Backlinks_default()]
};
var defaultListPageLayout = {
  beforeBody: [ArticleTitle_default()],
  left: [
    PageTitle_default(),
    MobileOnly_default(Spacer_default()),
    Search_default(),
    Darkmode_default(),
    DesktopOnly_default(RecentNotes_default({
      title: "Recent Notes",
      limit: 3,
      filter: (f) => f.frontmatter?.date,
      linkToMore: "notes/"
    }))
  ],
  right: []
};

// quartz/plugins/emitters/contentPage.tsx
var ContentPage = /* @__PURE__ */ __name((userOpts) => {
  const opts = {
    ...sharedPageComponents,
    ...defaultContentPageLayout,
    pageBody: Content_default(),
    ...userOpts
  };
  const { head: Head, header, beforeBody, pageBody, left, right, footer: Footer } = opts;
  const Header2 = Header_default();
  const Body2 = Body_default();
  return {
    name: "ContentPage",
    getQuartzComponents() {
      return [Head, Header2, Body2, ...header, ...beforeBody, pageBody, ...left, ...right, Footer];
    },
    async emit(ctx, content, resources, emit) {
      const cfg = ctx.cfg.configuration;
      const fps = [];
      const allFiles = content.map((c) => c[1].data);
      for (const [tree, file] of content) {
        const slug2 = file.data.slug;
        const externalResources = pageResources(slug2, resources);
        const componentData = {
          fileData: file.data,
          externalResources,
          cfg,
          children: [],
          tree,
          allFiles
        };
        const content2 = renderPage(slug2, componentData, opts, externalResources);
        const fp = await emit({
          content: content2,
          slug: slug2,
          ext: ".html"
        });
        fps.push(fp);
      }
      return fps;
    }
  };
}, "ContentPage");

// quartz/plugins/vfile.ts
import { VFile } from "vfile";
function defaultProcessedContent(vfileData) {
  const root = { type: "root", children: [] };
  const vfile = new VFile("");
  vfile.data = vfileData;
  return [root, vfile];
}
__name(defaultProcessedContent, "defaultProcessedContent");

// quartz/plugins/emitters/tagPage.tsx
var TagPage = /* @__PURE__ */ __name((userOpts) => {
  const opts = {
    ...sharedPageComponents,
    ...defaultListPageLayout,
    pageBody: TagContent_default(),
    ...userOpts
  };
  const { head: Head, header, beforeBody, pageBody, left, right, footer: Footer } = opts;
  const Header2 = Header_default();
  const Body2 = Body_default();
  return {
    name: "TagPage",
    getQuartzComponents() {
      return [Head, Header2, Body2, ...header, ...beforeBody, pageBody, ...left, ...right, Footer];
    },
    async emit(ctx, content, resources, emit) {
      const fps = [];
      const allFiles = content.map((c) => c[1].data);
      const cfg = ctx.cfg.configuration;
      const tags = new Set(
        allFiles.flatMap((data) => data.frontmatter?.tags ?? []).flatMap(getAllSegmentPrefixes)
      );
      tags.add("index");
      const tagDescriptions = Object.fromEntries(
        [...tags].map((tag) => {
          const title = tag === "" ? "Tag Index" : `Tag: #${tag}`;
          return [
            tag,
            defaultProcessedContent({
              slug: joinSegments("tags", tag),
              frontmatter: { title, tags: [] }
            })
          ];
        })
      );
      for (const [tree, file] of content) {
        const slug2 = file.data.slug;
        if (slug2.startsWith("tags/")) {
          const tag = slug2.slice("tags/".length);
          if (tags.has(tag)) {
            tagDescriptions[tag] = [tree, file];
          }
        }
      }
      for (const tag of tags) {
        const slug2 = joinSegments("tags", tag);
        const externalResources = pageResources(slug2, resources);
        const [tree, file] = tagDescriptions[tag];
        const componentData = {
          fileData: file.data,
          externalResources,
          cfg,
          children: [],
          tree,
          allFiles
        };
        const content2 = renderPage(slug2, componentData, opts, externalResources);
        const fp = await emit({
          content: content2,
          slug: file.data.slug,
          ext: ".html"
        });
        fps.push(fp);
      }
      return fps;
    }
  };
}, "TagPage");

// quartz/plugins/emitters/folderPage.tsx
import path5 from "path";
var FolderPage = /* @__PURE__ */ __name((userOpts) => {
  const opts = {
    ...sharedPageComponents,
    ...defaultListPageLayout,
    pageBody: FolderContent_default(),
    ...userOpts
  };
  const { head: Head, header, beforeBody, pageBody, left, right, footer: Footer } = opts;
  const Header2 = Header_default();
  const Body2 = Body_default();
  return {
    name: "FolderPage",
    getQuartzComponents() {
      return [Head, Header2, Body2, ...header, ...beforeBody, pageBody, ...left, ...right, Footer];
    },
    async emit(ctx, content, resources, emit) {
      const fps = [];
      const allFiles = content.map((c) => c[1].data);
      const cfg = ctx.cfg.configuration;
      const folders = new Set(
        allFiles.flatMap((data) => {
          const slug2 = data.slug;
          const folderName = path5.dirname(slug2 ?? "");
          if (slug2 && folderName !== "." && folderName !== "tags") {
            return [folderName];
          }
          return [];
        })
      );
      const folderDescriptions = Object.fromEntries(
        [...folders].map((folder) => [
          folder,
          defaultProcessedContent({
            slug: joinSegments(folder, "index"),
            frontmatter: { title: `Folder: ${folder}`, tags: [] }
          })
        ])
      );
      for (const [tree, file] of content) {
        const slug2 = _stripSlashes(simplifySlug(file.data.slug));
        if (folders.has(slug2)) {
          folderDescriptions[slug2] = [tree, file];
        }
      }
      for (const folder of folders) {
        const slug2 = joinSegments(folder, "index");
        const externalResources = pageResources(slug2, resources);
        const [tree, file] = folderDescriptions[folder];
        const componentData = {
          fileData: file.data,
          externalResources,
          cfg,
          children: [],
          tree,
          allFiles
        };
        const content2 = renderPage(slug2, componentData, opts, externalResources);
        const fp = await emit({
          content: content2,
          slug: slug2,
          ext: ".html"
        });
        fps.push(fp);
      }
      return fps;
    }
  };
}, "FolderPage");

// quartz/plugins/emitters/contentIndex.ts
import path6 from "path";
var defaultOptions11 = {
  enableSiteMap: true,
  enableRSS: true,
  includeEmptyFiles: true
};
function generateSiteMap(cfg, idx) {
  const base = cfg.baseUrl ?? "";
  const createURLEntry = /* @__PURE__ */ __name((slug2, content) => `<url>
    <loc>https://${base}/${slug2}</loc>
    <lastmod>${content.date?.toISOString()}</lastmod>
  </url>`, "createURLEntry");
  const urls = Array.from(idx).map(([slug2, content]) => createURLEntry(simplifySlug(slug2), content)).join("");
  return `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls}</urlset>`;
}
__name(generateSiteMap, "generateSiteMap");
function generateRSSFeed(cfg, idx) {
  const base = cfg.baseUrl ?? "";
  const root = `https://${base}`;
  const createURLEntry = /* @__PURE__ */ __name((slug2, content) => `<item>
    <title>${content.title}</title>
    <link>${root}/${slug2}</link>
    <guid>${root}/${slug2}</guid>
    <description>${content.description}</description>
    <pubDate>${content.date?.toUTCString()}</pubDate>
  </item>`, "createURLEntry");
  const items = Array.from(idx).map(([slug2, content]) => createURLEntry(simplifySlug(slug2), content)).join("");
  return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
    <channel>
      <title>${cfg.pageTitle}</title>
      <link>${root}</link>
      <description>Recent content on ${cfg.pageTitle}</description>
      <generator>Quartz -- quartz.jzhao.xyz</generator>
      ${items}
    </channel>
  </rss>`;
}
__name(generateRSSFeed, "generateRSSFeed");
var ContentIndex = /* @__PURE__ */ __name((opts) => {
  opts = { ...defaultOptions11, ...opts };
  return {
    name: "ContentIndex",
    async emit(ctx, content, _resources, emit) {
      const cfg = ctx.cfg.configuration;
      const emitted = [];
      const linkIndex = /* @__PURE__ */ new Map();
      for (const [_tree, file] of content) {
        const slug2 = file.data.slug;
        const date = getDate(ctx.cfg.configuration, file.data) ?? /* @__PURE__ */ new Date();
        if (opts?.includeEmptyFiles || file.data.text && file.data.text !== "") {
          linkIndex.set(slug2, {
            title: file.data.frontmatter?.title,
            links: file.data.links ?? [],
            tags: file.data.frontmatter?.tags ?? [],
            content: file.data.text ?? "",
            date,
            description: file.data.description ?? ""
          });
        }
      }
      if (opts?.enableSiteMap) {
        emitted.push(
          await emit({
            content: generateSiteMap(cfg, linkIndex),
            slug: "sitemap",
            ext: ".xml"
          })
        );
      }
      if (opts?.enableRSS) {
        emitted.push(
          await emit({
            content: generateRSSFeed(cfg, linkIndex),
            slug: "index",
            ext: ".xml"
          })
        );
      }
      const fp = path6.join("static", "contentIndex");
      const simplifiedIndex = Object.fromEntries(
        Array.from(linkIndex).map(([slug2, content2]) => {
          delete content2.description;
          delete content2.date;
          return [slug2, content2];
        })
      );
      emitted.push(
        await emit({
          content: JSON.stringify(simplifiedIndex),
          slug: fp,
          ext: ".json"
        })
      );
      return emitted;
    },
    getQuartzComponents: () => []
  };
}, "ContentIndex");

// quartz/plugins/emitters/aliases.ts
import path7 from "path";
var AliasRedirects = /* @__PURE__ */ __name(() => ({
  name: "AliasRedirects",
  getQuartzComponents() {
    return [];
  },
  async emit({ argv }, content, _resources, emit) {
    const fps = [];
    for (const [_tree, file] of content) {
      const ogSlug = simplifySlug(file.data.slug);
      const dir = path7.posix.relative(argv.directory, file.dirname ?? argv.directory);
      let aliases = file.data.frontmatter?.aliases ?? file.data.frontmatter?.alias ?? [];
      if (typeof aliases === "string") {
        aliases = [aliases];
      }
      for (const alias of aliases) {
        const slug2 = path7.posix.join(dir, alias);
        const redirUrl = resolveRelative(slug2, file.data.slug);
        const fp = await emit({
          content: `
            <!DOCTYPE html>
            <html lang="en-us">
            <head>
            <title>${ogSlug}</title>
            <link rel="canonical" href="${redirUrl}">
            <meta name="robots" content="noindex">
            <meta charset="utf-8">
            <meta http-equiv="refresh" content="0; url=${redirUrl}">
            </head>
            </html>
            `,
          slug: slug2,
          ext: ".html"
        });
        fps.push(fp);
      }
    }
    return fps;
  }
}), "AliasRedirects");

// quartz/plugins/emitters/assets.ts
import path9 from "path";
import fs2 from "fs";

// quartz/util/glob.ts
import path8 from "path";
import { globby } from "globby";
function toPosixPath(fp) {
  return fp.split(path8.sep).join("/");
}
__name(toPosixPath, "toPosixPath");
async function glob(pattern, cwd, ignorePatterns) {
  const fps = (await globby(pattern, {
    cwd,
    ignore: ignorePatterns,
    gitignore: true
  })).map(toPosixPath);
  return fps;
}
__name(glob, "glob");

// quartz/plugins/emitters/assets.ts
var Assets = /* @__PURE__ */ __name(() => {
  return {
    name: "Assets",
    getQuartzComponents() {
      return [];
    },
    async emit({ argv, cfg }, _content, _resources, _emit) {
      const assetsPath = argv.output;
      const fps = await glob("**", argv.directory, ["**/*.md", ...cfg.configuration.ignorePatterns]);
      const res = [];
      for (const fp of fps) {
        const ext = path9.extname(fp);
        const src = joinSegments(argv.directory, fp);
        const name = slugifyFilePath(fp, true) + ext;
        const dest = joinSegments(assetsPath, name);
        const dir = path9.dirname(dest);
        await fs2.promises.mkdir(dir, { recursive: true });
        await fs2.promises.copyFile(src, dest);
        res.push(dest);
      }
      return res;
    }
  };
}, "Assets");

// quartz/plugins/emitters/static.ts
import fs3 from "fs";
var Static = /* @__PURE__ */ __name(() => ({
  name: "Static",
  getQuartzComponents() {
    return [];
  },
  async emit({ argv, cfg }, _content, _resources, _emit) {
    const staticPath = joinSegments(QUARTZ, "static");
    const fps = await glob("**", staticPath, cfg.configuration.ignorePatterns);
    await fs3.promises.cp(staticPath, joinSegments(argv.output, "static"), {
      recursive: true
    });
    return fps.map((fp) => joinSegments(argv.output, "static", fp));
  }
}), "Static");

// quartz/components/scripts/spa.inline.ts
var spa_inline_default = "";

// quartz/components/scripts/plausible.inline.ts
var plausible_inline_default = "";

// quartz/components/scripts/popover.inline.ts
var popover_inline_default = "";

// quartz/styles/base.scss
var base_default = "";

// quartz/components/styles/popover.scss
var popover_default = "";

// quartz/util/theme.ts
var DEFAULT_SANS_SERIF = '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif';
var DEFAULT_MONO = "ui-monospace, SFMono-Regular, SF Mono, Menlo, monospace";
function googleFontHref(theme) {
  const { code, header, body } = theme.typography;
  return `https://fonts.googleapis.com/css2?family=${code}&family=${header}:wght@400;700&family=${body}:ital,wght@0,400;0,600;1,400;1,600&display=swap`;
}
__name(googleFontHref, "googleFontHref");
function joinStyles(theme, ...stylesheet) {
  return `
${stylesheet.join("\n\n")}

:root {
  --light: ${theme.colors.lightMode.light};
  --lightgray: ${theme.colors.lightMode.lightgray};
  --gray: ${theme.colors.lightMode.gray};
  --darkgray: ${theme.colors.lightMode.darkgray};
  --dark: ${theme.colors.lightMode.dark};
  --secondary: ${theme.colors.lightMode.secondary};
  --tertiary: ${theme.colors.lightMode.tertiary};
  --highlight: ${theme.colors.lightMode.highlight};

  --headerFont: "${theme.typography.header}", ${DEFAULT_SANS_SERIF};
  --bodyFont: "${theme.typography.body}", ${DEFAULT_SANS_SERIF};
  --codeFont: "${theme.typography.code}", ${DEFAULT_MONO};
}

:root[saved-theme="dark"] {
  --light: ${theme.colors.darkMode.light};
  --lightgray: ${theme.colors.darkMode.lightgray};
  --gray: ${theme.colors.darkMode.gray};
  --darkgray: ${theme.colors.darkMode.darkgray};
  --dark: ${theme.colors.darkMode.dark};
  --secondary: ${theme.colors.darkMode.secondary};
  --tertiary: ${theme.colors.darkMode.tertiary};
  --highlight: ${theme.colors.darkMode.highlight};
}
`;
}
__name(joinStyles, "joinStyles");

// quartz/plugins/emitters/componentResources.ts
import { Features, transform } from "lightningcss";
function getComponentResources(ctx) {
  const allComponents = /* @__PURE__ */ new Set();
  for (const emitter of ctx.cfg.plugins.emitters) {
    const components = emitter.getQuartzComponents(ctx);
    for (const component of components) {
      allComponents.add(component);
    }
  }
  const componentResources = {
    css: /* @__PURE__ */ new Set(),
    beforeDOMLoaded: /* @__PURE__ */ new Set(),
    afterDOMLoaded: /* @__PURE__ */ new Set()
  };
  for (const component of allComponents) {
    const { css, beforeDOMLoaded, afterDOMLoaded } = component;
    if (css) {
      componentResources.css.add(css);
    }
    if (beforeDOMLoaded) {
      componentResources.beforeDOMLoaded.add(beforeDOMLoaded);
    }
    if (afterDOMLoaded) {
      componentResources.afterDOMLoaded.add(afterDOMLoaded);
    }
  }
  return {
    css: [...componentResources.css],
    beforeDOMLoaded: [...componentResources.beforeDOMLoaded],
    afterDOMLoaded: [...componentResources.afterDOMLoaded]
  };
}
__name(getComponentResources, "getComponentResources");
function joinScripts(scripts) {
  return scripts.map((script) => `(function () {${script}})();`).join("\n");
}
__name(joinScripts, "joinScripts");
function addGlobalPageResources(ctx, staticResources, componentResources) {
  const cfg = ctx.cfg.configuration;
  const reloadScript = ctx.argv.serve;
  if (cfg.enablePopovers) {
    componentResources.afterDOMLoaded.push(popover_inline_default);
    componentResources.css.push(popover_default);
  }
  if (cfg.analytics?.provider === "google") {
    const tagId = cfg.analytics.tagId;
    staticResources.js.push({
      src: `https://www.googletagmanager.com/gtag/js?id=${tagId}`,
      contentType: "external",
      loadTime: "afterDOMReady"
    });
    componentResources.afterDOMLoaded.push(`
      window.dataLayer = window.dataLayer || [];
      function gtag() { dataLayer.push(arguments); }
      gtag(\`js\`, new Date());
      gtag(\`config\`, \`${tagId}\`, { send_page_view: false });
  
      document.addEventListener(\`nav\`, () => {
        gtag(\`event\`, \`page_view\`, {
          page_title: document.title,
          page_location: location.href,
        });
      });`);
  } else if (cfg.analytics?.provider === "plausible") {
    componentResources.afterDOMLoaded.push(plausible_inline_default);
  }
  if (cfg.enableSPA) {
    componentResources.afterDOMLoaded.push(spa_inline_default);
  } else {
    componentResources.afterDOMLoaded.push(`
        window.spaNavigate = (url, _) => window.location.assign(url)
        const event = new CustomEvent("nav", { detail: { url: document.body.dataset.slug } })
        document.dispatchEvent(event)`);
  }
  let wsUrl = `ws://localhost:${ctx.argv.wsPort}`;
  if (ctx.argv.remoteDevHost) {
    wsUrl = `wss://${ctx.argv.remoteDevHost}:${ctx.argv.wsPort}`;
  }
  if (reloadScript) {
    staticResources.js.push({
      loadTime: "afterDOMReady",
      contentType: "inline",
      script: `
          const socket = new WebSocket('${wsUrl}')
          socket.addEventListener('message', () => document.location.reload())
        `
    });
  }
}
__name(addGlobalPageResources, "addGlobalPageResources");
var defaultOptions12 = {
  fontOrigin: "googleFonts"
};
var ComponentResources = /* @__PURE__ */ __name((opts) => {
  const { fontOrigin } = { ...defaultOptions12, ...opts };
  return {
    name: "ComponentResources",
    getQuartzComponents() {
      return [];
    },
    async emit(ctx, _content, resources, emit) {
      const componentResources = getComponentResources(ctx);
      if (fontOrigin === "googleFonts") {
        resources.css.push(googleFontHref(ctx.cfg.configuration.theme));
      } else if (fontOrigin === "local") {
      }
      addGlobalPageResources(ctx, resources, componentResources);
      const stylesheet = joinStyles(ctx.cfg.configuration.theme, base_default, ...componentResources.css);
      const prescript = joinScripts(componentResources.beforeDOMLoaded);
      const postscript = joinScripts(componentResources.afterDOMLoaded);
      const fps = await Promise.all([
        emit({
          slug: "index",
          ext: ".css",
          content: transform({
            filename: "index.css",
            code: Buffer.from(stylesheet),
            minify: true,
            targets: {
              safari: 15 << 16 | 6 << 8,
              // 15.6
              ios_saf: 15 << 16 | 6 << 8,
              // 15.6
              edge: 115 << 16,
              firefox: 102 << 16,
              chrome: 109 << 16
            },
            include: Features.MediaQueries
          }).code.toString()
        }),
        emit({
          slug: "prescript",
          ext: ".js",
          content: prescript
        }),
        emit({
          slug: "postscript",
          ext: ".js",
          content: postscript
        })
      ]);
      return fps;
    }
  };
}, "ComponentResources");

// quartz.config.ts
var config = {
  configuration: {
    pageTitle: "\u{1F338} JACARANDA",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "plausible"
    },
    baseUrl: "nottacoz.github.io",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "created",
    theme: {
      typography: {
        header: "Schibsted Grotesk",
        body: "Source Sans Pro",
        code: "IBM Plex Mono"
      },
      colors: {
        lightMode: {
          light: "#faf8f8",
          lightgray: "#e5e5e5",
          gray: "#b8b8b8",
          darkgray: "#4e4e4e",
          dark: "#2b2b2b",
          secondary: "#284b63",
          tertiary: "#84a59d",
          highlight: "rgba(143, 159, 169, 0.15)"
        },
        darkMode: {
          light: "#282a36",
          lightgray: "#393639",
          gray: "#646464",
          darkgray: "#d4d4d4",
          dark: "#f8f8f2",
          secondary: "#bd93f9",
          tertiary: "#FFB86C",
          highlight: "rgba(143, 159, 169, 0.15)"
        }
      }
    }
  },
  plugins: {
    transformers: [
      FrontMatter(),
      TableOfContents(),
      CreatedModifiedDate({
        priority: ["frontmatter", "filesystem"]
        // you can add 'git' here for last modified from Git but this makes the build slower
      }),
      SyntaxHighlighting(),
      ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      GitHubFlavoredMarkdown(),
      CrawlLinks({ markdownLinkResolution: "shortest" }),
      Latex({ renderEngine: "katex" }),
      Description()
    ],
    filters: [RemoveDrafts()],
    emitters: [
      AliasRedirects(),
      ComponentResources({ fontOrigin: "googleFonts" }),
      ContentPage(),
      FolderPage(),
      TagPage(),
      ContentIndex({
        enableSiteMap: true,
        enableRSS: true
      }),
      Assets(),
      Static()
    ]
  }
};
var quartz_config_default = config;

// quartz/processors/parse.ts
import esbuild from "esbuild";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

// quartz/util/perf.ts
import chalk from "chalk";
import pretty from "pretty-time";
var PerfTimer = class {
  static {
    __name(this, "PerfTimer");
  }
  evts;
  constructor() {
    this.evts = {};
    this.addEvent("start");
  }
  addEvent(evtName) {
    this.evts[evtName] = process.hrtime();
  }
  timeSince(evtName) {
    return chalk.yellow(pretty(process.hrtime(this.evts[evtName ?? "start"])));
  }
};

// quartz/processors/parse.ts
import { read } from "to-vfile";
import path10 from "path";
import workerpool, { Promise as WorkerPromise } from "workerpool";

// quartz/util/log.ts
import { Spinner } from "cli-spinner";

// quartz/util/trace.ts
import chalk2 from "chalk";
import process2 from "process";
import { isMainThread } from "workerpool";
var rootFile = /.*at file:/;
function trace(msg, err) {
  const stack = err.stack;
  const lines = [];
  lines.push("");
  lines.push(
    "\n" + chalk2.bgRed.black.bold(" ERROR ") + "\n" + chalk2.red(` ${msg}`) + (err.message.length > 0 ? `: ${err.message}` : "")
  );
  if (!stack) {
    return;
  }
  let reachedEndOfLegibleTrace = false;
  for (const line of stack.split("\n").slice(1)) {
    if (reachedEndOfLegibleTrace) {
      break;
    }
    if (!line.includes("node_modules")) {
      lines.push(` ${line}`);
      if (rootFile.test(line)) {
        reachedEndOfLegibleTrace = true;
      }
    }
  }
  const traceMsg = lines.join("\n");
  if (!isMainThread) {
    throw new Error(traceMsg);
  } else {
    console.error(traceMsg);
    process2.exit(1);
  }
}
__name(trace, "trace");

// quartz/processors/parse.ts
function createProcessor(ctx) {
  const transformers = ctx.cfg.plugins.transformers;
  let processor = unified().use(remarkParse);
  for (const plugin of transformers.filter((p) => p.markdownPlugins)) {
    processor = processor.use(plugin.markdownPlugins(ctx));
  }
  processor = processor.use(remarkRehype, { allowDangerousHtml: true });
  for (const plugin of transformers.filter((p) => p.htmlPlugins)) {
    processor = processor.use(plugin.htmlPlugins(ctx));
  }
  return processor;
}
__name(createProcessor, "createProcessor");
function createFileParser(ctx, fps) {
  const { argv, cfg } = ctx;
  return async (processor) => {
    const res = [];
    for (const fp of fps) {
      try {
        const perf = new PerfTimer();
        const file = await read(fp);
        file.value = file.value.toString().trim();
        for (const plugin of cfg.plugins.transformers.filter((p) => p.textTransform)) {
          file.value = plugin.textTransform(ctx, file.value);
        }
        file.data.slug = slugifyFilePath(path10.posix.relative(argv.directory, file.path));
        file.data.filePath = fp;
        const ast = processor.parse(file);
        const newAst = await processor.run(ast, file);
        res.push([newAst, file]);
        if (argv.verbose) {
          console.log(`[process] ${fp} -> ${file.data.slug} (${perf.timeSince()})`);
        }
      } catch (err) {
        trace(`
Failed to process \`${fp}\``, err);
      }
    }
    return res;
  };
}
__name(createFileParser, "createFileParser");

// quartz/util/sourcemap.ts
import fs4 from "fs";
import { fileURLToPath } from "url";
var options = {
  // source map hack to get around query param
  // import cache busting
  retrieveSourceMap(source) {
    if (source.includes(".quartz-cache")) {
      let realSource = fileURLToPath(source.split("?", 2)[0] + ".map");
      return {
        map: fs4.readFileSync(realSource, "utf8")
      };
    } else {
      return null;
    }
  }
};

// quartz/worker.ts
sourceMapSupport.install(options);
async function parseFiles(argv, fps, allSlugs) {
  const ctx = {
    cfg: quartz_config_default,
    argv,
    allSlugs
  };
  const processor = createProcessor(ctx);
  const parse = createFileParser(ctx, fps);
  return parse(processor);
}
__name(parseFiles, "parseFiles");
export {
  parseFiles
};
//# sourceMappingURL=transpiled-worker.mjs.map
