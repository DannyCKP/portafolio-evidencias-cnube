(function () {
  "use strict";

  var $ = function (sel, scope) { return (scope || document).querySelector(sel); };
  var $$ = function (sel, scope) { return Array.prototype.slice.call((scope || document).querySelectorAll(sel)); };

  function safe(fn, name) {
    try { fn(); } catch (e) { console.warn("[" + name + "]", e); }
  }

  function escHTML(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  var pdfObjectUrls = []; // track to revoke on re-render

  /* ---------------- Nav ---------------- */
  function initNav() {
    var nav = $("[data-nav]");
    var toggle = $("[data-nav-toggle]");
    var links = $("[data-nav-links]");
    if (!nav) return;
    var onScroll = function () {
      if (window.scrollY > 12) nav.classList.add("is-solid");
      else nav.classList.remove("is-solid");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    if (toggle && links) {
      toggle.addEventListener("click", function () {
        var open = links.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
      $$("a", links).forEach(function (a) {
        a.addEventListener("click", function () {
          links.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
        });
      });
    }
  }

  /* ---------------- Merge seed data + IndexedDB ---------------- */
  function getMergedEvidencias() {
    var seed = window.__EVIDENCIAS__ || [];
    if (!window.EvidenciasDB) return Promise.resolve(seed.map(function (e) { return { ev: e, source: "seed" }; }));
    return window.EvidenciasDB.getAll().then(function (stored) {
      var byId = {};
      seed.forEach(function (e) { byId[e.id] = { ev: e, source: "seed" }; });
      stored.forEach(function (e) { byId[e.id] = { ev: e, source: "user" }; }); // user entries override seed with same id
      return Object.keys(byId).map(function (id) { return byId[id]; });
    });
  }

  /* ---------------- Render evidencias ---------------- */
  function renderEvidencias() {
    var list = $("[data-evidencias-list]");
    var objetivosList = $("[data-objetivos-list]");
    var anexosList = $("[data-anexos-list]");
    if (!list) return;

    pdfObjectUrls.forEach(function (u) { URL.revokeObjectURL(u); });
    pdfObjectUrls = [];

    getMergedEvidencias().then(function (entries) {
      if (!entries.length) {
        list.innerHTML = "<p>Todavía no hay evidencias cargadas.</p>";
        return;
      }

      list.innerHTML = entries.map(function (entry) {
        var ev = entry.ev;
        var resultadosHtml = Array.isArray(ev.resultados)
          ? (ev.resultados.length ? "<ul>" + ev.resultados.map(function (r) { return "<li>" + escHTML(r) + "</li>"; }).join("") + "</ul>" : "")
          : (ev.resultados ? "<p>" + escHTML(ev.resultados) + "</p>" : "");

        var anexoHtml = "";
        if (ev.anexo && ev.anexo.archivo) {
          anexoHtml = '<div class="evidencia-anexo"><a href="' + escHTML(ev.anexo.archivo) + '" target="_blank" rel="noopener">📎 ' + escHTML(ev.anexo.etiqueta || "Ver anexo") + '</a></div>';
        } else if (ev.pdfBlob) {
          var url = URL.createObjectURL(ev.pdfBlob);
          pdfObjectUrls.push(url);
          anexoHtml = '<div class="evidencia-anexo"><a href="' + url + '" target="_blank" rel="noopener">📎 Ver PDF adjunto (' + escHTML(ev.pdfName || "archivo.pdf") + ')</a></div>';
        }

        return (
          '<article class="evidencia-card" id="evidencia-' + escHTML(ev.id) + '">' +
            '<div class="evidencia-head">' +
              '<span class="evidencia-tag">Actividad ' + escHTML(ev.id) + (ev.tipo ? " · " + escHTML(ev.tipo) : "") + '</span>' +
              '<span class="evidencia-fecha">' + escHTML(ev.fecha || "") + (entry.source === "user" ? ' <span class="evidencia-user-badge">agregada por ti</span>' : '') + '</span>' +
            '</div>' +
            '<h3>' + escHTML(ev.titulo) + '</h3>' +
            (ev.objetivo ? '<p class="evidencia-objetivo">' + escHTML(ev.objetivo) + '</p>' : '') +
            (ev.descripcion ? '<div class="evidencia-block"><h4>Descripción</h4><p>' + escHTML(ev.descripcion) + '</p></div>' : '') +
            (resultadosHtml ? '<div class="evidencia-block"><h4>Resultados</h4>' + resultadosHtml + '</div>' : '') +
            (ev.reflexion ? (
              '<div class="evidencia-block"><h4>Reflexión personal</h4><div class="reflexion-box">' +
                (ev.draft ? '<span class="draft-badge">Borrador — personalízalo</span><br>' : '') +
                '<p>' + escHTML(ev.reflexion) + '</p>' +
              '</div></div>'
            ) : '') +
            anexoHtml +
            (entry.source === "user" ? '<button type="button" class="evidencia-delete" data-delete-evidencia="' + escHTML(ev.id) + '">Eliminar esta evidencia</button>' : '') +
          '</article>'
        );
      }).join("");

      if (objetivosList) {
        objetivosList.innerHTML = entries.filter(function (e) { return e.ev.objetivo; }).map(function (e) {
          return '<li>' + escHTML(e.ev.objetivo) + '</li>';
        }).join("");
      }

      if (anexosList) {
        anexosList.innerHTML = entries.filter(function (e) { return e.ev.anexo && e.ev.anexo.archivo; }).map(function (e) {
          return (
            '<li><span>Actividad ' + escHTML(e.ev.id) + ' — ' + escHTML(e.ev.titulo) + '</span>' +
            '<a href="' + escHTML(e.ev.anexo.archivo) + '" target="_blank" rel="noopener">Abrir PDF →</a></li>'
          );
        }).join("");
      }

      $$("[data-delete-evidencia]", list).forEach(function (btn) {
        btn.addEventListener("click", function () {
          var id = btn.getAttribute("data-delete-evidencia");
          if (!confirm('¿Eliminar la evidencia "' + id + '"? Esta acción no se puede deshacer.')) return;
          window.EvidenciasDB.delete(id).then(renderEvidencias);
        });
      });
    });
  }

  /* ---------------- Add-evidence form ---------------- */
  function initAddForm() {
    var form = $("[data-add-form]");
    if (!form || !window.EvidenciasDB) return;
    var toggle = $("[data-add-toggle]");
    var fields = $("[data-add-fields]");
    var status = $("[data-add-status]");

    if (toggle) {
      toggle.addEventListener("click", function () {
        fields.hidden = !fields.hidden;
        toggle.textContent = fields.hidden ? "+ Agregar nueva evidencia" : "− Ocultar formulario";
      });
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var id = $("#f-id", form).value.trim();
      if (!id) return;

      var resultadosRaw = $("#f-resultados", form).value.trim();
      var resultados = resultadosRaw ? resultadosRaw.split("\n").map(function (s) { return s.trim(); }).filter(Boolean) : [];

      var evidencia = {
        id: id,
        titulo: $("#f-titulo", form).value.trim(),
        fecha: $("#f-fecha", form).value.trim(),
        tipo: $("#f-tipo", form).value.trim(),
        objetivo: $("#f-objetivo", form).value.trim(),
        descripcion: $("#f-descripcion", form).value.trim(),
        resultados: resultados,
        reflexion: $("#f-reflexion", form).value.trim(),
        draft: true
      };

      var fileInput = $("#f-pdf", form);
      var file = fileInput.files && fileInput.files[0];

      var save = function () {
        window.EvidenciasDB.put(evidencia).then(function () {
          form.reset();
          fields.hidden = true;
          toggle.textContent = "+ Agregar nueva evidencia";
          status.hidden = false;
          status.textContent = "Evidencia \"" + id + "\" guardada.";
          setTimeout(function () { status.hidden = true; }, 3500);
          renderEvidencias();
        });
      };

      if (file) {
        evidencia.pdfBlob = file;
        evidencia.pdfName = file.name;
        save();
      } else {
        save();
      }
    });
  }

  /* ---------------- Export to evidencias.js ---------------- */
  function initExport() {
    var btn = $("[data-export-js]");
    if (!btn) return;
    btn.addEventListener("click", function () {
      getMergedEvidencias().then(function (entries) {
        var list = entries.map(function (e) {
          var ev = {};
          ["id", "titulo", "fecha", "tipo", "objetivo", "descripcion", "resultados", "reflexion", "draft"].forEach(function (k) {
            if (ev[k] !== undefined || e.ev[k] !== undefined) ev[k] = e.ev[k];
          });
          if (e.ev.anexo) {
            ev.anexo = e.ev.anexo;
          } else if (e.ev.pdfName) {
            ev.anexo = { archivo: "anexos/" + e.ev.pdfName, etiqueta: "Ver actividad completa (PDF)" };
          }
          return ev;
        });

        var body = "(function () {\n  \"use strict\";\n\n  window.__EVIDENCIAS__ = " +
          JSON.stringify(list, null, 2) + ";\n})();\n";

        var blob = new Blob([body], { type: "application/javascript" });
        var url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = "evidencias.js";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(function () { URL.revokeObjectURL(url); }, 2000);

        var hasPdfBlobs = entries.some(function (e) { return e.ev.pdfBlob && !e.ev.anexo; });
        if (hasPdfBlobs) {
          alert("Se descargó evidencias.js. Si adjuntaste PDFs desde el formulario, cópialos manualmente a la carpeta anexos/ con el mismo nombre de archivo con el que los subiste, y reemplaza data/evidencias.js con el archivo descargado.");
        } else {
          alert("Se descargó evidencias.js — reemplaza el archivo en data/evidencias.js con este.");
        }
      });
    });
  }

  /* ---------------- Boot ---------------- */
  function boot() {
    safe(initNav, "initNav");
    safe(renderEvidencias, "renderEvidencias");
    safe(initAddForm, "initAddForm");
    safe(initExport, "initExport");
    document.documentElement.classList.add("is-ready");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
