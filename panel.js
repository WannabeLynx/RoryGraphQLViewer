
// File to listen to network requests and updates the panel's table if needed.
document.addEventListener('DOMContentLoaded', function() {
    const requestsTableBody = document.getElementById('requests-table-body');
    const clearLogButton = document.getElementById('clear-log-button');
    const detailsViewer = document.getElementById('details-viewer');
    const tableContainer = document.getElementById('table-container');
    const splitter = document.getElementById('splitter');

    let requestsCache = [];
    let nextRequestId = 0;
    let activeRequestId = null;

    let tableFlexBasis = 60;
    let detailsFlexBasis = 40;

    if (!requestsTableBody || !detailsViewer || !tableContainer || !splitter) {
        console.error("[GraphQL Inspector] Core UI elements not found.");
        return;
    }

    tableContainer.style.flexBasis = `${tableFlexBasis}%`;
    detailsViewer.style.flexBasis = `${detailsFlexBasis}%`;

    function closeDetailsPanel() {
        detailsViewer.classList.remove('visible');
        splitter.classList.remove('visible');
        tableContainer.style.flexBasis = '100%';
        detailsViewer.style.flexBasis = '0%';
        detailsViewer.innerHTML = '<div class="details-placeholder">Select a request to see details.</div>';

        if (activeRequestId !== null) {
            const activeRow = document.querySelector(`.request-row[data-request-id='${activeRequestId}']`);
            if (activeRow) {
                activeRow.classList.remove('active-request');
            }
            activeRequestId = null;
        }
    }


    if (clearLogButton) {
        clearLogButton.addEventListener('click', function() {
            requestsTableBody.innerHTML = '';
            requestsCache = [];
            nextRequestId = 0;
            closeDetailsPanel();
        });
    }

    function extractOperationNameFromQuery(queryString) {
        if (typeof queryString !== 'string') return null;
        const query = queryString.trim();

        const explicitOpNameMatch = query.match(/^(?:query|mutation)\s+([_A-Za-z][_A-Za-z0-9]*)/);
        if (explicitOpNameMatch && explicitOpNameMatch[1]) {
            return explicitOpNameMatch[1];
        }

        const firstBraceIndex = query.indexOf('{');
        if (firstBraceIndex !== -1) {
            const afterFirstBrace = query.substring(firstBraceIndex + 1);
            const firstFieldMatch = afterFirstBrace.match(/^\s*([_A-Za-z][_A-Za-z0-9]*)/);
            if (firstFieldMatch && firstFieldMatch[1]) {
                return firstFieldMatch[1];
            }
        }
        return null;
    }

    /**
     * Adds a request row to the panel's table.
     * @param {string} time The request duration.
     */
    function addRequestToTable(id, name, url, method, status, time, contentType) {
        const row = requestsTableBody.insertRow(-1);
        row.className = 'request-row';
        row.setAttribute('data-request-id', id);

        const nameCell = row.insertCell();
        nameCell.textContent = name;
        nameCell.title = name;

        const urlCell = row.insertCell();
        urlCell.textContent = url;
        urlCell.title = url; 

        const methodCell = row.insertCell();
        methodCell.textContent = method;
        methodCell.className = 'method';

        const statusCell = row.insertCell();
        statusCell.textContent = status;
        statusCell.className = status >= 400 ? 'status-error' : 'status-ok';

        const timeCell = row.insertCell();
        timeCell.textContent = time;
        timeCell.title = time;
        timeCell.classList.add('time-value');


        const typeCell = row.insertCell();
        typeCell.textContent = contentType || 'N/A';
        typeCell.title = contentType || 'N/A';


        row.addEventListener('click', () => displayRequestDetails(id, row));

        if (requestsTableBody.rows.length < 50 && activeRequestId === null) {
             tableContainer.scrollTop = tableContainer.scrollHeight;
        }
    }

    /**
     * Displays request/response details in the side panel.
     */
    function displayRequestDetails(requestId, clickedRowElement) {
        const requestData = requestsCache.find(r => r.id === requestId);
        if (!requestData) {
            console.error('[GraphQL Inspector] Request data not found for ID:', requestId);
            return;
        }

        if (!detailsViewer.classList.contains('visible') || activeRequestId !== requestId) {
            tableContainer.style.flexBasis = `${tableFlexBasis}%`;
            detailsViewer.style.flexBasis = `${detailsFlexBasis}%`;
            detailsViewer.classList.add('visible');
            splitter.classList.add('visible');
        }

        if (activeRequestId !== null && activeRequestId !== requestId) {
            const previouslyActiveRow = document.querySelector(`.request-row[data-request-id='${activeRequestId}']`);
            if (previouslyActiveRow) {
                previouslyActiveRow.classList.remove('active-request');
            }
        }
        if (clickedRowElement) {
            clickedRowElement.classList.add('active-request');
        }
        activeRequestId = requestId;


        const sanitize = (str) => str ? String(str).replace(/</g, "&lt;").replace(/>/g, "&gt;") : 'N/A';

        let headersContent = '<div class="details-section">';
        headersContent += '<h3>Request Headers</h3><pre>';
        if (requestData.devtoolsRequest.request.headers.length > 0) {
            requestData.devtoolsRequest.request.headers.forEach(h => headersContent += `${sanitize(h.name)}: ${sanitize(h.value)}\n`);
        } else {
            headersContent += 'N/A';
        }
        headersContent += '</pre>';

        headersContent += '<h3>Response Headers</h3><pre>';
        if (requestData.devtoolsRequest.response.headers.length > 0) {
            requestData.devtoolsRequest.response.headers.forEach(h => headersContent += `${sanitize(h.name)}: ${sanitize(h.value)}\n`);
        } else {
            headersContent += 'N/A';
        }
        headersContent += '</pre>';
        headersContent += '</div>';

        let payloadContent = '<pre>';
        if (requestData.requestBody) {
            let bodyToDisplay = requestData.requestBody;
            try {
                const parsedOuterJson = JSON.parse(requestData.requestBody);
                if (typeof parsedOuterJson === 'object' && parsedOuterJson !== null && typeof parsedOuterJson.query === 'string') {
                    bodyToDisplay = parsedOuterJson.query;
                } else {
                    bodyToDisplay = JSON.stringify(parsedOuterJson, null, 2);
                }
            } catch (e) {
                // Not JSON
            }
            payloadContent += sanitize(bodyToDisplay);
        } else {
            payloadContent += 'N/A';
        }
        payloadContent += '</pre>';

        let responseContent = '<pre>';
        const responseMimeType = requestData.devtoolsRequest.response.content.mimeType;
        if (requestData.responseBody) {
            if (responseMimeType && responseMimeType.includes('json')) {
                try {
                    const parsedResponse = JSON.parse(requestData.responseBody);
                    responseContent += sanitize(JSON.stringify(parsedResponse, null, 2));
                } catch (e) {
                    responseContent += sanitize(requestData.responseBody);
                }
            } else {
                 responseContent += sanitize(requestData.responseBody);
            }
        } else {
            responseContent += 'N/A';
        }
        responseContent += '</pre>';

        detailsViewer.innerHTML = `
            <button class="details-close-button" id="details-close-btn" title="Close Details">&times;</button>
            <div class="tabs">
                <button class="tab-button active" data-tab-target="headers-${requestId}">Headers</button>
                <button class="tab-button" data-tab-target="payload-${requestId}">Payload</button>
                <button class="tab-button" data-tab-target="response-${requestId}">Response</button>
            </div>
            <div class="tab-content-wrapper">
                <div id="headers-${requestId}" class="tab-content active">${headersContent}</div>
                <div id="payload-${requestId}" class="tab-content">${payloadContent}</div>
                <div id="response-${requestId}" class="tab-content">${responseContent}</div>
            </div>
        `;

        const closeBtn = document.getElementById('details-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeDetailsPanel);
        }

        detailsViewer.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', (event) => {
                const targetId = event.target.getAttribute('data-tab-target');
                detailsViewer.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
                detailsViewer.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
                event.target.classList.add('active');
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.classList.add('active');
                } else {
                    console.warn("[GraphQL Inspector] Tab content not found for ID:", targetId);
                }
            });
        });

        if (clickedRowElement && typeof clickedRowElement.scrollIntoView === 'function') {
            clickedRowElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    // --- Splitter Logic ---
    let isDraggingSplitter = false;
    let startX, startTableWidth, startDetailsWidth;

    splitter.addEventListener('mousedown', function(e) {
        isDraggingSplitter = true;
        startX = e.clientX;
        startTableWidth = tableContainer.offsetWidth;
        startDetailsWidth = detailsViewer.offsetWidth;
        document.body.style.cursor = 'col-resize';
        tableContainer.style.userSelect = 'none';
        detailsViewer.style.userSelect = 'none';
    });

    document.addEventListener('mousemove', function(e) {
        if (!isDraggingSplitter) return;
        e.preventDefault();

        const deltaX = e.clientX - startX;
        let newTableWidth = startTableWidth + deltaX;
        let newDetailsWidth = startDetailsWidth - deltaX;

        const minPanelWidth = Math.min(200, tableContainer.parentElement.offsetWidth * 0.2);

        if (newTableWidth < minPanelWidth) {
            newTableWidth = minPanelWidth;
            newDetailsWidth = startTableWidth + startDetailsWidth - newTableWidth;
        }
        if (newDetailsWidth < minPanelWidth) {
            newDetailsWidth = minPanelWidth;
            newTableWidth = startTableWidth + startDetailsWidth - newDetailsWidth;
        }

        const totalWidth = tableContainer.parentElement.offsetWidth;
        tableFlexBasis = (newTableWidth / totalWidth) * 100;
        detailsFlexBasis = (newDetailsWidth / totalWidth) * 100;

        tableContainer.style.flexBasis = `${tableFlexBasis}%`;
        detailsViewer.style.flexBasis = `${detailsFlexBasis}%`;
    });

    document.addEventListener('mouseup', function() {
        if (isDraggingSplitter) {
            isDraggingSplitter = false;
            document.body.style.cursor = 'default';
            tableContainer.style.userSelect = '';
            detailsViewer.style.userSelect = '';
        }
    });


    // Listen for finished network requests
    chrome.devtools.network.onRequestFinished.addListener(request => {
        const reqUrl = request.request.url.toLowerCase();
        const method = request.request.method;
        const requestId = nextRequestId++;
        const requestTime = request.time;
        const formattedTime = requestTime > 0 ? `${requestTime.toFixed(0)} ms` : "-";


        let isPotentiallyGraphQLURL = reqUrl.includes('graphql') || reqUrl.includes('gql');
        let operationName = null;
        let isConfirmedGraphQL = false;
        let requestBodyForCache = null;

        if (method === "POST" && request.request.postData) {
            requestBodyForCache = request.request.postData.text;
            if (requestBodyForCache) {
                try {
                    const postData = JSON.parse(requestBodyForCache);
                    let queryToParse = null;
                    if (Array.isArray(postData) && postData.length > 0) {
                        if (postData[0].operationName) {
                            operationName = postData[0].operationName + " (batch)";
                        } else if (postData[0].query) {
                            queryToParse = postData[0].query;
                        }
                        isConfirmedGraphQL = true;
                    } else if (postData.operationName) {
                        operationName = postData.operationName;
                        isConfirmedGraphQL = true;
                    } else if (postData.query && typeof postData.query === 'string') {
                        queryToParse = postData.query;
                        isConfirmedGraphQL = true;
                    }

                    if (queryToParse && !operationName) {
                        operationName = extractOperationNameFromQuery(queryToParse);
                        if (Array.isArray(postData) && postData.length > 0 && operationName) {
                           operationName += " (batch)";
                        }
                    }

                } catch (e) {
                    if (typeof requestBodyForCache === 'string' &&
                        (requestBodyForCache.trim().startsWith('{') ||
                         requestBodyForCache.trim().toLowerCase().startsWith('query') ||
                         requestBodyForCache.trim().toLowerCase().startsWith('mutation'))) {
                        operationName = extractOperationNameFromQuery(requestBodyForCache);
                        if (operationName) isConfirmedGraphQL = true;
                    }
                }
            }
        } else if (method === "GET") {
            if (request.request.queryString && request.request.queryString.length > 0) {
                requestBodyForCache = request.request.queryString.map(p => `${p.name}=${p.value}`).join('&');
            }
            if (isPotentiallyGraphQLURL) {
                let gqlQueryString = null;
                let explicitOpName = null;
                if (request.request.queryString) {
                    const queryParam = request.request.queryString.find(p => p.name.toLowerCase() === 'query');
                    if (queryParam) gqlQueryString = queryParam.value;
                    const opNameParam = request.request.queryString.find(p => p.name.toLowerCase() === 'operationname');
                    if (opNameParam) explicitOpName = opNameParam.value;
                }
                if (explicitOpName) {
                    operationName = explicitOpName;
                    isConfirmedGraphQL = true;
                } else if (gqlQueryString) {
                    operationName = extractOperationNameFromQuery(gqlQueryString);
                    if (operationName) isConfirmedGraphQL = true;
                }
            }
        }

        request.getContent((responseBody, encoding) => {
            let displayName;
            if (isConfirmedGraphQL) {
                displayName = operationName || "GraphQL Operation (Unnamed)";
            } else if (isPotentiallyGraphQLURL) {
                displayName = "GraphQL (Potential/Unparsed)";
            } else {
                return;
            }

            requestsCache.push({
                id: requestId,
                devtoolsRequest: request,
                opName: displayName,
                requestBody: requestBodyForCache,
                responseBody: responseBody,
                responseEncoding: encoding
            });

            addRequestToTable(
                requestId,
                displayName,
                request.request.url,
                request.request.method,
                request.response.status,
                formattedTime,
                request.response.content.mimeType
            );
        });
    });

    chrome.devtools.network.onNavigated.addListener(function() {
        if (requestsTableBody) {
            requestsTableBody.innerHTML = '';
        }
        requestsCache = [];
        nextRequestId = 0;
        closeDetailsPanel();
    });

    tableContainer.style.flexBasis = '100%';
    detailsViewer.style.flexBasis = '0%';
    detailsViewer.classList.remove('visible');
    splitter.classList.remove('visible');


    console.log("Rory's Stuff is loaded and listeners attached.");
});
