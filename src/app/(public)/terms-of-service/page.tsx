export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="bg-white rounded-[2rem] p-8 md:p-12 lg:p-16 shadow-sm border border-black/5">
          <div className="mb-12">
            <h1 className="text-3xl md:text-5xl font-bold text-title caros mb-4">
              Terms of Service
            </h1>
            <p className="text-muted-foreground text-lg poppins">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="space-y-8 text-base md:text-lg text-description poppins leading-relaxed">
            <section>
              <h2 className="text-xl md:text-2xl font-bold text-title mb-4 caros">
                1. Agreement to Terms
              </h2>
              <p>
                By accessing our website and using our services, you agree to be
                bound by these Terms of Service and all applicable laws and
                regulations. If you do not agree with any of these terms, you
                are prohibited from using or accessing this site.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-bold text-title mb-4 caros">
                2. Use License
              </h2>
              <p>
                Permission is granted to temporarily download one copy of the
                materials (information or software) on IMMICA&apos;s website for
                personal, non-commercial transitory viewing only. This is the
                grant of a license, not a transfer of title, and under this
                license you may not:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>modify or copy the materials;</li>
                <li>
                  use the materials for any commercial purpose, or for any
                  public display (commercial or non-commercial);
                </li>
                <li>
                  attempt to decompile or reverse engineer any software
                  contained on IMMICA&apos;s website;
                </li>
                <li>
                  remove any copyright or other proprietary notations from the
                  materials; or
                </li>
                <li>
                  transfer the materials to another person or &quot;mirror&quot;
                  the materials on any other server.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-bold text-title mb-4 caros">
                3. Disclaimer
              </h2>
              <p>
                The materials on IMMICA&apos;s website are provided on an
                &apos;as is&apos; basis. IMMICA makes no warranties, expressed
                or implied, and hereby disclaims and negates all other
                warranties including, without limitation, implied warranties or
                conditions of merchantability, fitness for a particular purpose,
                or non-infringement of intellectual property or other violation
                of rights.
              </p>
              <p className="mt-4">
                Furthermore, IMMICA does not warrant or make any representations
                concerning the accuracy, likely results, or reliability of the
                use of the materials on its website or otherwise relating to
                such materials or on any sites linked to this site.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-bold text-title mb-4 caros">
                4. Limitations
              </h2>
              <p>
                In no event shall IMMICA or its suppliers be liable for any
                damages (including, without limitation, damages for loss of data
                or profit, or due to business interruption) arising out of the
                use or inability to use the materials on IMMICA&apos;s website,
                even if IMMICA or a IMMICA authorized representative has been
                notified orally or in writing of the possibility of such damage.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-bold text-title mb-4 caros">
                5. Accuracy of Materials
              </h2>
              <p>
                The materials appearing on IMMICA&apos;s website could include
                technical, typographical, or photographic errors. IMMICA does
                not warrant that any of the materials on its website are
                accurate, complete or current. IMMICA may make changes to the
                materials contained on its website at any time without notice.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-bold text-title mb-4 caros">
                6. Governing Law
              </h2>
              <p>
                These terms and conditions are governed by and construed in
                accordance with the laws of Canada and you irrevocably submit to
                the exclusive jurisdiction of the courts in that location.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
