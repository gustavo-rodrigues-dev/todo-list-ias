import * as uuid from 'uuid';
import * as opentelemetry from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import * as api from '@opentelemetry/api';

// enable logging ONLY for developement
// this is useful for debugging instrumentation issues
// remove from production after issues (if any) are resolved
// view more logging levels here: https://github.com/open-telemetry/opentelemetry-js-api/blob/main/src/diag/types.ts#L67
api.diag.setLogger(new api.DiagConsoleLogger(), api.DiagLogLevel.DEBUG);

// Step 1. Declare the resource to be used.
//    A resource represents a collection of attributes describing the
//    service. This collection of attributes will be associated with all
//    telemetry generated from this service (traces, metrics, logs).
const resource = new Resource({
  [SemanticResourceAttributes.SERVICE_NAME]: 'API-TODO-IAS',
  [SemanticResourceAttributes.SERVICE_INSTANCE_ID]: uuid.v4(),
});

// Step 2: Enable auto-instrumentation from the meta package.
const instrumentations = [getNodeAutoInstrumentations()];

// Step 3: Configure the OTLP/PROTO trace exporter.
//    The following assumes you've set the OTEL_EXPORTER_OTLP_ENDPOINT and OTEL_EXPORTER_OLTP_HEADERS
//    environment variables.
// const traceExporter = new OTLPTraceExporter();

// If you haven't set the OTEL_EXPORTER_OTLP_ENDPOINT and OTEL_EXPORTER_OLTP_HEADERS
// environment variables, you can configure the OTLP exporter programmatically by
// uncommenting the following code:

// this endpoint contains a path since this exporter is signal specific (traces)
// see more details here: https://docs.newrelic.com/docs/more-integrations/open-source-telemetry-integrations/opentelemetry/opentelemetry-quick-start/#note-endpoints
const url = 'https://otlp.nr-data.net:4317/v1/traces';

const collectorOptions = {
  url,
  headers: {
    'api-key': process.env.NEW_RELIC_TOKEN,
  },
};

const traceExporter = new OTLPTraceExporter(collectorOptions);

// // Step 4: Configure the OpenTelemetry NodeSDK to export traces.
const sdk = new opentelemetry.NodeSDK({
  resource,
  traceExporter,
  instrumentations,
});

// Step 5: Initialize the SDK and register with the OpenTelemetry API:
//    this enables the API to record telemetry
sdk
  .start()
  .then(() => console.log('Tracing initialized'))
  .catch(error => console.log('Error initializing tracing', error));

// Step 6: Gracefully shut down the SDK on process exit
process.on('SIGTERM', () => {
  sdk
    .shutdown()
    .then(() => console.log('Tracing terminated'))
    .catch(error => console.log('Error terminating tracing', error))
    .finally(() => process.exit(0));
});
