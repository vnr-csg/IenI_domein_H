<!doctype html>
<html lang="nl">
    <head>
        <meta charset="utf8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="icon" href="data:,">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.3/font/bootstrap-icons.css">
        <title>Bestanden bij de Module</title>
    </head>
    <body class="container" style="background-color: rgba(0, 0, 0, 0.1);">
        <main class="mx-5 p-5">
            <div class="container mx-3 my-2 shadow p-5 bg-body rounded">
                <h1 class="fw-bold text-center mb-4">
                    <i class="bi bi-folder2-open"></i>
                    Bestanden bij de Module
                </h1>
                <div class="row">
                    <div class="col m-1 px-5 py-1">
                        <div class="mb-5">
                            <h2>
                                <i class="bi bi-1-circle-fill"></i>
                                Hoofdstuk 1
                            </h2>
                            <?php
                                $files = scandir("H1/");
                                $ignored_files = [".", "..","assets"];
                                echo "<ul>";
                                foreach ($files as $file) {
                                    if (!in_array($file, $ignored_files)) {
                                        echo '<li><a title="' . $file . '" href="/lesmateriaal/bestanden_module/H1/' . $file . '" target="_blank"><strong>' . $file . '</strong></a></li>';
                                    }
                                }
                            ?>
                        </div>
                        <div>
                            <h2>
                                <i class="bi bi-person-workspace"></i>
                                Extern
                            </h2>
                            <ul>
                                <li><a href="https://www.ted.com/talks/susan_etlinger_what_do_we_do_with_all_this_big_data?subtitle=nl" target="_blank"><strong>H1O02 TED big data</strong></a></li>
                                <li><a href="https://iknowwhereyourcatlives.com" target="_blank"><strong>H1O09 Kattendata</strong></a></li>
                                <li><a href="https://www.youtube.com/watch?v=bjvIpI-1w84" target="_blank"><strong>H1O11 NULL</strong></a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="col m-2 px-5 py-1">
                        <div class="mb-5">
                        <h2>
                            <i class="bi bi-3-circle-fill"></i>
                            Hoofdstuk 3
                            </h2>
                            <?php
                                $files = scandir("H3/");
                                $ignored_files = [".", ".."];
                                echo "<ul>";
                                foreach ($files as $file) {
                                    if (!in_array($file, $ignored_files)) {
                                        echo '<li><a title="' . $file . '" href="/lesmateriaal/bestanden_module/H3/' . $file . '" target="_blank"><strong>' . $file . '</strong></a></li>';
                                    }
                                }
                            ?>
                        </div>
                        <div>
                            <h2>
                                <i class="bi bi-person-workspace"></i>
                                Extern
                            </h2>                            
                            <ul>
                                <li><a href="https://www.ted.com/talks/mark_liddell_how_statistics_can_be_misleading?subtitle=en" target="_blank"><strong>H3O05 TED misleading data</strong></a></li>
                                <li><a href="https://www.rivm.nl/corona/actueel/weekcijfers" target="_blank"><strong>H3O06 RIVM Weekcijfers coronavirus</strong></a></li>
                                <li><a href="https://ourworldindata.org/explorers/coronavirus-data-explorer?tab=map&zoomToSelection=true&time=2020-01-17&region=Europe&facet=none&country=FRA~ESP~ITA~DEU~IND~BRA~MEX~RUS~BEL&pickerSort=asc&pickerMetric=location&Metric=Confirmed+deaths&Interval=Cumulative&Relative+to+Population=false&Color+by+test+positivity=false" target="_blank"><strong>H3O06 Our World in Data: COVID-19 deaths</strong></a></li>
                                <li><a href="https://aatishb.com/covidtrends/?data=deaths&location=Belgium&location=Brazil&location=Canada&location=France&location=Germany&location=India&location=Italy&location=Mexico&location=Netherlands&location=Russia&location=Spain&location=US" target="_blank"><strong>H3O06 Aatishb: Covid 19 reported Deaths</strong></a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div class="container mt-5">
                <footer class="d-flex flex-wrap align-items-center justify-content-between py-3 my-4 mx-5">
                    <span class="text-muted">&copy;SLO 2024</span>
                </footer>
            </div>
        </main>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous"></script>
        <script>
            // Add bootstrap tooltips
            var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
            var tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
                return new bootstrap.Tooltip(tooltipTriggerEl)
            })
        </script>
    </body>
</html>