d3.csv('/static/data/analysis.csv').then(data => {
    // Parse and prepare
    data.forEach(d => {
        d.em_dash_percent = +d.em_dash_percent;
        d.num_emdash     = +d.num_emdash;
        d.num_posts      = +d.num_posts;
    });

    // filter out 2025
    data = data.filter(d => !d.month.startsWith('2025'));

    // precompute totals per subreddit
    let totalUsageBySub   = {};
    let totalEmCountBySub = {};
    let totalPostsBySub   = {};
    data.forEach(d => {
        totalUsageBySub[d.subreddit]   = (totalUsageBySub[d.subreddit]   || 0) + d.em_dash_percent;
        totalEmCountBySub[d.subreddit] = (totalEmCountBySub[d.subreddit] || 0) + d.num_emdash;
        totalPostsBySub[d.subreddit]   = (totalPostsBySub[d.subreddit]   || 0) + d.num_posts;
    });

    // subreddits with any em-dash%
    let subreddits = Array.from(new Set(data.map(d => d.subreddit)))
        .filter(sub => totalUsageBySub[sub] > 0);

    let months = Array.from(new Set(data.map(d => d.month))).sort();

    // container setup
    let mainContainer = d3.select('#svg_line_plot')
        .html('')
        .style('display','flex')
        .style('justify-content','center');

    let plotContainer     = mainContainer.append('div');
    let controlsContainer = mainContainer.append('div')
        .style('margin-left','20px');

    // search & dropdown UI
    controlsContainer.append('label')
        .attr('for','subreddit_search')
        .style('font-weight','bold')
        .text('Select Subreddits:');

    let searchContainer = controlsContainer.append('div')
        .style('position','relative')
        .style('display','inline-block');

    let searchInput = searchContainer.append('input')
        .attr('type','text')
        .attr('id','subreddit_search')
        .attr('placeholder','Search subreddits');

    let select = searchContainer.append('select')
        .attr('id','subreddit_select')
        .attr('multiple', true)

        

    select.selectAll('option')
        .data(subreddits)
        .enter()
        .append('option')
        .attr('value', d => d)
        .text(d => d);

    select.selectAll('option').property('selected', true);

    // control buttons (below the dropdown)
    let buttonsContainer = controlsContainer.append('div')
        .style('margin-top','0px')
        .style('display','flex')
        .style('flex-wrap','wrap');

    buttonsContainer.append('button')
        .text('Show All')
        .attr('class','btn')
        .on('click', () => {
            select.selectAll('option').property('selected', true);
            draw(subreddits);
        });

    buttonsContainer.append('button')
        .text('Top 10 Posts')
        .attr('class','btn')
        .on('click', () => {
            let top10 = Object.entries(totalPostsBySub)
                .sort((a,b)=>b[1]-a[1]).slice(0,10).map(d=>d[0]);
            select.selectAll('option').property('selected', d => top10.includes(d));
            draw(top10);
        });

    buttonsContainer.append('button')
        .text('Top 10 Em Dashes')
        .attr('class','btn')
        .on('click', () => {
            let top10 = Object.entries(totalEmCountBySub)
                .sort((a,b)=>b[1]-a[1]).slice(0,10).map(d=>d[0]);
            select.selectAll('option').property('selected', d => top10.includes(d));
            draw(top10);
        });

    buttonsContainer.append('button')
        .text('No Em Dashes')
        .attr('class','btn')
        .on('click', () => {
            let none = Object.entries(totalEmCountBySub)
                .filter(d=>d[1]===0).map(d=>d[0]);
            select.selectAll('option').property('selected', d => none.includes(d));
            draw(none);
        });

    // core drawing function
    function draw(selectedSubs) {
        plotContainer.selectAll('svg').remove();

        // build per-sub series
        let series = selectedSubs.map(sub => ({
            name: sub,
            values: months.map(month => {
                let found = data.find(d=>d.subreddit===sub && d.month===month);
                return { month, em_dash_percent: found ? found.em_dash_percent : 0 };
            })
        }));

        // decide whether to draw overall-average
        let showOverall = series.length > 1
                        && selectedSubs.some(sub => totalEmCountBySub[sub] > 0);

        let overallAverageSeries;
        if (showOverall) {
            overallAverageSeries = {
                name: 'Overall Average',
                values: months.map(month => {
                    let vals = data
                        .filter(d=>d.month===month && selectedSubs.includes(d.subreddit))
                        .map(d=>d.em_dash_percent);
                    return { month, em_dash_percent: d3.mean(vals) || 0 };
                })
            };
        }

        // SVG + scales
        const width  = 800, height = 400;
        const margin = {top:50, right:160, bottom:60, left:60};
        const svg = plotContainer.append('svg')
            .attr('width',width)
            .attr('height',height)
            .attr('viewBox',`0 0 ${width} ${height}`)
            .attr('preserveAspectRatio','xMidYMid meet');

        const x = d3.scalePoint()
            .domain(months)
            .range([margin.left, width - margin.right]);

        const y = d3.scaleLinear()
            .domain([0,
                d3.max(series.flatMap(s=>s.values.map(v=>v.em_dash_percent))) * 1.1 || 1
            ])
            .range([height - margin.bottom, margin.top]);

        svg.append('g')
            .attr('transform',`translate(0,${height-margin.bottom})`)
            .call(d3.axisBottom(x)
                .tickFormat(m=>m.replace(/\b(\w{3}) (\d{4})/,'$1 $2')))
            .selectAll('text')
            .attr('transform','rotate(-30)')
            .style('text-anchor','end');

        svg.append('g')
            .attr('transform',`translate(${margin.left},0)`)
            .call(d3.axisLeft(y).tickFormat(d=>d+'%'));

        const color = d3.scaleOrdinal(
            d3.schemeTableau10.concat(d3.schemePastel1, ['yellow'])
        ).domain([...subreddits, 'Overall Average']);

        const line = d3.line()
            .x(d=>x(d.month))
            .y(d=>y(d.em_dash_percent));

        // draw subreddit lines & dots
        svg.selectAll('.line.subreddit')
            .data(series)
            .enter().append('path')
            .attr('class','line subreddit')
            .attr('fill','none')
            .attr('stroke', d=>color(d.name))
            .attr('stroke-width',2.5)
            .attr('stroke-opacity',0.6)
            .attr('d', d=>line(d.values));

        svg.selectAll('.dot.subreddit')
            .data(series.flatMap(s=>s.values.map(v=>({...v,name:s.name}))))
            .enter().append('circle')
            .attr('class','dot subreddit')
            .attr('cx', d=>x(d.month))
            .attr('cy', d=>y(d.em_dash_percent))
            .attr('r',3)
            .attr('fill', d=>color(d.name));

        // draw overall if needed
        if (showOverall) {
            svg.selectAll('.line.overall')
                .data([overallAverageSeries])
                .enter().append('path')
                .attr('class','line overall')
                .attr('fill','none')
                .attr('stroke','#5E5E5E')
                .attr('stroke-width',3.5)
                .attr('stroke-opacity',1.0)
                .attr('d', d=>line(d.values));

            svg.selectAll('.dot.overall')
                .data(overallAverageSeries.values.map(v=>({...v,name:overallAverageSeries.name})))
                .enter().append('circle')
                .attr('class','dot overall')
                .attr('cx', d=>x(d.month))
                .attr('cy', d=>y(d.em_dash_percent))
                .attr('r',5)
                .attr('fill','#5E5E5E');
        }

        // titles
        svg.append('text')
            .attr('x',width/2)
            .attr('y',margin.top/2)
            .attr('text-anchor','middle')
            .attr('font-size','18px')
            .attr('font-weight','bold')
            .text('Em-Dash Usage Trends Over Time (Selected Subreddits)');

        svg.append('text')
            .attr('transform','rotate(-90)')
            .attr('y',18)
            .attr('x',-height/2)
            .attr('text-anchor','middle')
            .attr('font-size','15px')
            .text('Percentage of Posts with Em Dashes');

        // legend
        let legendData = showOverall
            ? [overallAverageSeries].concat(series.slice(0, 14))
            : series.slice(0, 15);

        const legend = svg.selectAll('.legend')
            .data(legendData)
            .enter().append('g')
            .attr('class','legend')
            .attr('transform',(d,i)=>`translate(${width-margin.right+20},${margin.top + i*22})`);

        legend.append('rect')
            .attr('width',18)
            .attr('height',18)
            .attr('fill', d => d.name === 'Overall Average' ? '#5E5E5E' : color(d.name));

        legend.append('text')
            .attr('x',24)
            .attr('y',13)
            .attr('font-size','14px')
            .text(d => d.name === 'Overall Average' ? d.name : (d.name.startsWith('r/') ? d.name : 'r/'+d.name));
    }

    // initial draw
    draw(subreddits);

    // filter dropdown on search
    searchInput.on('input', function() {
        const term = this.value.toLowerCase();
        if (!term) {
            select.selectAll('option').property('selected',true);
            draw(subreddits);
        }
        select.selectAll('option')
              .style('display', d=>d.toLowerCase().includes(term) ? null : 'none');
    });

    // redraw on manual select
    d3.select('#subreddit_select').on('change', function() {
        const chosen = Array.from(this.selectedOptions).map(o=>o.value);
        draw(chosen.length ? chosen : subreddits);
    });
});
